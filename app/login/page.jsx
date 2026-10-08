"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEMO_USER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Friendly Kurdish messages for common Supabase auth errors.
function kurdishError(message = "") {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "هەژماری نموونە هێشتا دروست نەکراوە. فایلی supabase/demo-user.sql لە Supabase جێبەجێ بکە.";
  if (m.includes("email not confirmed")) return "هەژماری نموونە پشتڕاست نەکراوەتەوە.";
  if (m.includes("fetch") || m.includes("network")) return "پەیوەندی بە سێرڤەرەوە نەکرا. ئینتەرنێتەکەت بپشکنە.";
  return "هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەرەوە.";
}

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Send the user to the right page based on their profile.
  async function goHome(userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed")
      .eq("id", userId)
      .maybeSingle();

    let target = "/opportunities";
    if (profile?.role === "admin") target = "/admin";
    else if (!profile?.onboarding_completed) target = "/onboarding";

    router.replace(target);
    router.refresh();
  }

  // One click: sign in as the demo user (create it first if email confirmation is off).
  async function loginAsDemo() {
    setError("");
    setLoading(true);
    try {
      const credentials = { email: DEMO_USER.email, password: DEMO_USER.password };
      let { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error?.message?.toLowerCase().includes("invalid login credentials")) {
        const signUp = await supabase.auth.signUp({
          ...credentials,
          options: { data: { full_name: DEMO_USER.fullName } },
        });
        if (signUp.data?.session) {
          data = signUp.data;
          error = null;
        }
      }

      if (error) throw error;
      await goHome(data.user.id);
    } catch (err) {
      setError(kurdishError(err?.message));
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10 bg-gradient-to-b from-orange-50/50 to-slate-50/60">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">بەخێربێیتەوە</h1>
          <p className="text-sm text-slate-500 mt-1">بچۆ ژوورەوە بۆ بینینی دەرفەتەکانت</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0">
            {DEMO_USER.fullName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{DEMO_USER.fullName}</p>
            <p className="text-xs text-slate-500">هەژماری نموونە</p>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2" role="alert">
            {error}
          </p>
        )}

        <Button size="lg" className="w-full" onClick={loginAsDemo} isLoading={loading}>
          <span>چوونەژوورەوە وەک {DEMO_USER.fullName}</span>
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Card>
    </div>
  );
}
