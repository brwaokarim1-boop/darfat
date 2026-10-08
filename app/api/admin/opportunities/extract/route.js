import { NextResponse } from 'next/server';
import { extractOpportunities } from '@/lib/ai';
import { query } from '@/lib/db';

export async function POST(req) {
  try {
    const { text } = await req.json();
    const extractedData = await extractOpportunities(text, "Manual Entry");
    let inserted = 0;
    for (const opp of extractedData) {
      await query(`
        INSERT INTO opportunities (
          title, description, type, organizer, location, is_online, 
          deadline, required_skills, link, how_to_apply, benefits, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'draft')
      `, [
        opp.title, opp.description, opp.type, opp.organizer, opp.location, !!opp.is_online,
        opp.deadline ? new Date(opp.deadline) : null, JSON.stringify(opp.required_skills || []), opp.link, opp.how_to_apply, opp.benefits
      ]);
      inserted++;
    }
    return NextResponse.json({ success: true, count: inserted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
