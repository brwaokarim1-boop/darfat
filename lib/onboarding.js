/**
 * Onboarding questions (scripted for now).
 * Later, `chatOnboarding()` in lib/ai.js can replace this script;
 * the saved profile shape stays the same.
 */

export const ONBOARDING_STEPS = [
  {
    key: "city",
    type: "single",
    question: "لە کام شار دەژیت؟",
    options: ["هەولێر", "سلێمانی", "دهۆک", "هەڵەبجە", "کەرکووک", "گەرمیان", "زاخۆ", "بەغدا"],
    allowCustom: true,
    placeholder: "یان ناوی شارەکەت بنووسە...",
    reply: "زۆر باشە!",
  },
  {
    key: "age",
    type: "number",
    question: "تەمەنت چەندە؟",
    min: 13,
    max: 60,
    placeholder: "بۆ نموونە: ٢١",
    reply: "سوپاس!",
  },
  {
    key: "interests",
    type: "multi",
    question: "حەزت لە چ بوارێکە؟ دەتوانیت چەند دانەیەک هەڵبژێریت.",
    options: [
      "تەکنەلۆژیا",
      "دیزاین",
      "کارئافرینی و بازرگانی",
      "زانست و توێژینەوە",
      "هونەر و میدیا",
      "کاری کۆمەڵایەتی",
      "پەروەردە",
      "ژینگە",
      "وەرزش",
      "زمان و وەرگێڕان",
    ],
    allowCustom: true,
    placeholder: "بوارێکی تر زیاد بکە...",
    reply: "بوارە جوانەکانن!",
  },
  {
    key: "skills",
    type: "multi",
    question: "چ کارامەییەکت هەیە؟ ئەوانە هەڵبژێرە کە تێیاندا باشیت.",
    options: [
      "پڕۆگرامسازی",
      "دیزاینی گرافیک",
      "UI/UX",
      "نووسین",
      "وێنەگرتن و ڤیدیۆ",
      "مارکێتینگ",
      "شیکاری داتا",
      "بەڕێوەبردنی پڕۆژە",
      "قسەکردن لەبەردەم خەڵک",
      "زمانی ئینگلیزی",
      "سەرکردایەتی",
      "کاری تیمی",
    ],
    allowCustom: true,
    placeholder: "کارامەییەکی تر زیاد بکە...",
    reply: "نایابە، ئەمانە زۆر بەکەڵکن.",
  },
  {
    key: "availability",
    type: "single",
    question: "زیاتر کەی کاتت بەتاڵە بۆ چالاکی؟",
    options: ["ڕۆژانی پشوو", "ئێواران", "بەیانیان", "هەر کاتێک", "کاتێکی کەمم هەیە"],
    allowCustom: true,
    placeholder: "یان بە وشەی خۆت بینووسە...",
    reply: "تێگەیشتم.",
  },
  {
    key: "bio",
    type: "text",
    question: "لە کۆتاییدا، بە یەک دوو ڕستە باسی خۆت بکە. چی دەخوێنیت یان چی دەکەیت؟",
    optional: true,
    placeholder: "بۆ نموونە: خوێندکاری کۆمپیوتەرم و حەزم لە دروستکردنی ئەپە...",
    reply: "سوپاس بۆ هەموو وەڵامەکانت!",
  },
];

export const STEP_LABELS = {
  city: "شار",
  age: "تەمەن",
  interests: "ئارەزووەکان",
  skills: "کارامەییەکان",
  availability: "کاتی بەتاڵ",
  bio: "دەربارەی من",
};

// Convert Western digits and Kurdish/Arabic-Indic digits to a number.
export function parseAge(value) {
  const western = String(value)
    .trim()
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  const n = Number.parseInt(western, 10);
  return Number.isFinite(n) ? n : null;
}

// Text shown in the user's chat bubble for an answer.
export function formatAnswer(value) {
  if (Array.isArray(value)) return value.join("، ");
  if (value === null || value === undefined || value === "") return "تێپەڕاندم";
  return String(value);
}
