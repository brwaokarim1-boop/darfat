"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, Check, RotateCcw, Plus, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ONBOARDING_STEPS, STEP_LABELS, parseAge, formatAnswer } from "@/lib/onboarding";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const TYPING_DELAY = 600;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function OnboardingPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]); // { from: "bot" | "user", text }
  const [typing, setTyping] = useState(false);
  // phase: intro -> asking -> review -> saving -> done
  const [phase, setPhase] = useState("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const started = useRef(false);

  const step = ONBOARDING_STEPS[stepIndex];

  // Add bot messages one by one with a short "typing" pause.
  async function botSay(...texts) {
    for (const text of texts) {
      setTyping(true);
      await wait(TYPING_DELAY);
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text }]);
    }
  }

  // Load the logged-in user and greet them.
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login");
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, onboarding_completed")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.onboarding_completed) {
          router.replace("/opportunities");
          return;
        }

        setUser(user);
        setLoading(false);

        const name = (profile?.full_name || user.user_metadata?.full_name || "").split(" ")[0];
        await botSay(
          name ? `سڵاو ${name}! بەخێربێیت بۆ دەرفەت.` : "سڵاو! بەخێربێیت بۆ دەرفەت.",
          "من یاریدەدەرەکەتم. چەند پرسیارێکی کورتت لێدەکەم بۆ ئەوەی باشترین دەرفەتەکانت بۆ بدۆزمەوە. تەنها یەک دوو خولەک دەخایەنێت."
        );
      } catch {
        setLoading(false);
        setError("نەتوانرا زانیارییەکانت باربکرێت. تکایە پەڕەکە نوێ بکەرەوە.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, phase]);

  async function start() {
    setPhase("asking");
    setMessages((m) => [...m, { from: "user", text: "با دەست پێبکەین" }]);
    await botSay(ONBOARDING_STEPS[0].question);
  }

  // Save one answer and move to the next question.
  async function answer(value) {
    const current = ONBOARDING_STEPS[stepIndex];
    setAnswers((a) => ({ ...a, [current.key]: value }));
    setMessages((m) => [...m, { from: "user", text: formatAnswer(value) }]);

    const next = stepIndex + 1;
    if (next < ONBOARDING_STEPS.length) {
      setStepIndex(next);
      await botSay(`${current.reply} ${ONBOARDING_STEPS[next].question}`);
    } else {
      setStepIndex(next);
      await botSay(current.reply, "ئەمە پوختەی زانیارییەکانتە. ئەگەر هەمووی ڕاستە، پاشەکەوتی بکە.");
      setPhase("review");
    }
  }

  async function restart() {
    setAnswers({});
    setStepIndex(0);
    setError("");
    setPhase("asking");
    setMessages((m) => [...m, { from: "user", text: "دەمەوێت سەرلەنوێ وەڵام بدەمەوە" }]);
    await botSay(`باشە، با سەرلەنوێ دەست پێبکەینەوە. ${ONBOARDING_STEPS[0].question}`);
  }

  // Write the answers into the profiles table.
  async function save() {
    setError("");
    setPhase("saving");
    try {
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          city: answers.city || null,
          age: answers.age ?? null,
          interests: answers.interests || [],
          skills: answers.skills || [],
          availability: answers.availability || null,
          bio: answers.bio || null,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (dbError) throw dbError;

      setPhase("done");
      await botSay("پرۆفایلەکەت ئامادەیە! ئێستا دەتبەمە سەر ئەو دەرفەتانەی بۆت دەگونجێن...");
      await wait(900);
      router.replace("/opportunities");
      router.refresh();
    } catch {
      setPhase("review");
      setError("ببورە، پاشەکەوتکردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدەرەوە.");
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner text="ئامادەکردنی گفتوگۆ..." />
      </div>
    );
  }

  const progress =
    phase === "intro" ? 0 : Math.round((Math.min(stepIndex, ONBOARDING_STEPS.length) / ONBOARDING_STEPS.length) * 100);

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header + progress */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">با یەکتر بناسین</h1>
            <p className="text-xs text-slate-500">چەند پرسیارێکی کورت بۆ دروستکردنی پرۆفایلەکەت</p>
          </div>
        </div>
        <div
          className="h-2 w-full rounded-full bg-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="ڕێژەی تەواوبوون"
        >
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-[320px] max-h-[60vh]" aria-live="polite">
          {messages.map((msg, i) => (
            <Bubble key={i} from={msg.from}>
              {msg.text}
            </Bubble>
          ))}

          {typing && <TypingBubble />}

          {(phase === "review" || phase === "saving") && !typing && (
            <ReviewCard answers={answers} />
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 bg-slate-50/60 p-3 sm:p-4">
          {error && (
            <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {phase === "intro" && (
            <Button size="lg" className="w-full" onClick={start} disabled={typing || messages.length < 2}>
              <span>با دەست پێبکەین</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}

          {phase === "asking" && step && !typing && (
            <StepInput key={step.key} step={step} onAnswer={answer} />
          )}

          {(phase === "review" || phase === "saving") && !typing && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="lg" className="flex-1" onClick={save} isLoading={phase === "saving"}>
                <Check className="w-4 h-4" />
                <span>ڕاستە، پاشەکەوتی بکە</span>
              </Button>
              <Button size="lg" variant="outline" onClick={restart} disabled={phase === "saving"}>
                <RotateCcw className="w-4 h-4" />
                <span>سەرلەنوێ</span>
              </Button>
            </div>
          )}

          {phase === "done" && <Spinner size="sm" text="گواستنەوە..." />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Chat pieces ---------- */

function Bubble({ from, children }) {
  const isBot = from === "bot";
  return (
    <div className={cn("flex", isBot ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
          isBot
            ? "bg-slate-100 text-slate-800 rounded-2xl rounded-ss-md"
            : "bg-orange-500 text-white rounded-2xl rounded-se-md"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start" aria-label="دەنووسێت">
      <div className="bg-slate-100 rounded-2xl rounded-ss-md px-4 py-3 flex gap-1.5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ answers }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
      <dl className="space-y-2.5 text-sm">
        {ONBOARDING_STEPS.map(({ key }) => (
          <div key={key} className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="font-semibold text-slate-700 sm:w-28 shrink-0">{STEP_LABELS[key]}</dt>
            <dd className="text-slate-600">
              {Array.isArray(answers[key]) ? (
                <span className="flex flex-wrap gap-1.5">
                  {answers[key].map((v) => (
                    <span key={v} className="px-2 py-0.5 rounded-md bg-white border border-orange-100 text-xs">
                      {v}
                    </span>
                  ))}
                </span>
              ) : (
                answers[key] || <span className="text-slate-400">—</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- Answer input per question type ---------- */

function StepInput({ step, onAnswer }) {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState(step.options || []);
  const [error, setError] = useState("");

  function submitText(e) {
    e?.preventDefault();
    const value = text.trim();

    if (step.type === "number") {
      const age = parseAge(value);
      if (age === null || age < step.min || age > step.max) {
        setError(`تکایە تەمەنێکی دروست بنووسە (${step.min} تا ${step.max}).`);
        return;
      }
      onAnswer(age);
      return;
    }

    if (step.type === "multi") {
      // In multi mode the text box adds a new chip.
      if (!value) return;
      if (!options.includes(value)) setOptions((o) => [...o, value]);
      if (!selected.includes(value)) setSelected((s) => [...s, value]);
      setText("");
      return;
    }

    if (!value) {
      if (step.optional) onAnswer(null);
      else setError("تکایە وەڵامێک بنووسە.");
      return;
    }
    onAnswer(value);
  }

  function toggle(option) {
    setError("");
    setSelected((s) => (s.includes(option) ? s.filter((x) => x !== option) : [...s, option]));
  }

  function submitMulti() {
    if (selected.length === 0) {
      setError("لانیکەم یەک دانە هەڵبژێرە.");
      return;
    }
    onAnswer(selected);
  }

  return (
    <div className="space-y-3">
      {/* Choice chips */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => (step.type === "single" ? onAnswer(option) : toggle(option))}
                aria-pressed={step.type === "multi" ? active : undefined}
                className={cn(
                  "min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer focus-ring inline-flex items-center gap-1.5",
                  active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                )}
              >
                {active && <Check className="w-3.5 h-3.5" />}
                {option}
              </button>
            );
          })}
        </div>
      )}

      {/* Free text */}
      {(step.type !== "single" || step.allowCustom) && (
        <form onSubmit={submitText} className="flex gap-2 items-end">
          {step.type === "text" ? (
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              placeholder={step.placeholder}
              rows={2}
              maxLength={500}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-ring resize-none"
            />
          ) : (
            <input
              type="text"
              inputMode={step.type === "number" ? "numeric" : "text"}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              placeholder={step.placeholder}
              maxLength={60}
              autoFocus={step.type === "number"}
              className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-ring"
            />
          )}
          <Button
            type="submit"
            size="icon"
            variant={step.type === "multi" ? "outline" : "primary"}
            aria-label={step.type === "multi" ? "زیادکردن" : "ناردن"}
          >
            {step.type === "multi" ? <Plus className="w-4 h-4" /> : <Send className="w-4 h-4 rotate-180" />}
          </Button>
        </form>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {step.type === "multi" && (
        <Button className="w-full" onClick={submitMulti} disabled={selected.length === 0}>
          <span>بەردەوامبە {selected.length > 0 ? `(${selected.length})` : ""}</span>
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}

      {step.optional && (
        <button
          type="button"
          onClick={() => onAnswer(null)}
          className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-4 cursor-pointer"
        >
          تێپەڕاندن
        </button>
      )}
    </div>
  );
}
