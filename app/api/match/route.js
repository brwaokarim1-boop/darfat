import { NextResponse } from 'next/server';
import { matchOpportunities } from '@/lib/ai';

export async function POST(req) {
  try {
    const { profile, opportunities } = await req.json();
    const matches = await matchOpportunities(profile, opportunities);
    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
