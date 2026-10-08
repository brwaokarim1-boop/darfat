import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { extractOpportunities } from '@/lib/ai';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sourceId } = body;
    
    // Fetch source URL from DB
    let sourcesToFetch = [];
    if (sourceId) {
      const res = await query('SELECT * FROM sources WHERE id = $1', [sourceId]);
      sourcesToFetch = res.rows;
    } else {
      const res = await query('SELECT * FROM sources WHERE is_active = true');
      sourcesToFetch = res.rows;
    }

    const results = [];

    for (const source of sourcesToFetch) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const fetchRes = await fetch(source.url, {
          headers: { 'User-Agent': 'DerfetBot' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!fetchRes.ok) throw new Error(`HTTP ${fetchRes.status}`);

        let html = await fetchRes.text();
        // Naive HTML to text: strip scripts and tags
        let text = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        text = text.slice(0, 12000);

        const extractedData = await extractOpportunities(text, source.url);
        
        let newCount = 0;
        
        // Deduplicate and Insert
        for (const opp of extractedData) {
          // Check if link exists
          const linkCheck = await query('SELECT id FROM opportunities WHERE link = $1', [opp.link]);
          
          if (linkCheck.rows.length === 0) {
            // Also check title + deadline to avoid duplicates if link is just sourceUrl
            let isDuplicate = false;
            if (opp.title) {
               const titleCheck = await query('SELECT id FROM opportunities WHERE title = $1 AND deadline IS NOT DISTINCT FROM $2', [opp.title, opp.deadline ? new Date(opp.deadline) : null]);
               if (titleCheck.rows.length > 0) isDuplicate = true;
            }

            if (!isDuplicate) {
              await query(`
                INSERT INTO opportunities (
                  title, description, type, organizer, location, is_online, 
                  deadline, required_skills, link, how_to_apply, benefits, status, source_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'draft', $12)
              `, [
                opp.title, opp.description, opp.type, opp.organizer, opp.location, !!opp.is_online,
                opp.deadline ? new Date(opp.deadline) : null, JSON.stringify(opp.required_skills || []), opp.link, opp.how_to_apply, opp.benefits, source.id
              ]);
              newCount++;
            }
          }
        }

        await query('UPDATE sources SET last_checked_at = NOW(), last_new_count = $1, last_error = NULL WHERE id = $2', [newCount, source.id]);
        results.push({ id: source.id, success: true, newCount });

      } catch (error) {
        await query('UPDATE sources SET last_checked_at = NOW(), last_error = $1 WHERE id = $2', [error.message, source.id]);
        results.push({ id: source.id, success: false, error: error.message });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
