import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Pages anyone can open without logging in.
const PUBLIC_PATHS = ["/"];

// Where a logged-in user belongs, based on their profile.
function homeFor(profile) {
  if (profile?.role === "admin") return "/admin";
  if (!profile?.onboarding_completed) return "/onboarding";
  return "/opportunities";
}

export async function proxy(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  // Refresh the auth session and keep cookies in sync.
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        Object.entries(headers || {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // API and auth routes handle their own checks; only refresh the session.
  if (path.startsWith("/api") || path.startsWith("/auth")) return response;

  // Redirect while keeping any refreshed auth cookies.
  const redirectTo = (target) => {
    const res = NextResponse.redirect(new URL(target, request.url));
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  const isPublic = PUBLIC_PATHS.includes(path);
  const isLogin = path === "/login";

  // Visitors: only public pages and /login.
  if (!user) {
    if (isPublic || isLogin) return response;
    return redirectTo("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  const home = homeFor(profile);
  const isAdmin = profile?.role === "admin";

  if (isLogin) return redirectTo(home);
  if (path.startsWith("/admin") && !isAdmin) return redirectTo(home);

  // Users must finish onboarding before using the app.
  if (!isAdmin && !isPublic) {
    if (!profile?.onboarding_completed && path !== "/onboarding") {
      return redirectTo("/onboarding");
    }
    if (profile?.onboarding_completed && path === "/onboarding") {
      return redirectTo(home);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except static files and images.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
