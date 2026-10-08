import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /auth/signout: end the session and go back to the landing page.
export async function POST(request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Even if sign-out fails, send the user home.
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
