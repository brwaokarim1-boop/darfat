import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 backdrop-blur-sm text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">دەرفەت (Derfet)</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              پلاتفۆرمی زیرەکی گەشەپێدان بۆ گەنجانی کوردستان. هەموو دەرفەتەکان لە یەک شوێن بە هاوکاری ژیریی دەستکرد.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-600">
            <Link href="/opportunities" className="hover:text-orange-600 transition-colors">
              دەرفەتەکان
            </Link>
            <Link href="/people" className="hover:text-orange-600 transition-colors">
              هاوتیمەکان
            </Link>
            <Link href="/tasks" className="hover:text-orange-600 transition-colors">
              ئەرکەکان
            </Link>
            <Link href="/profile" className="hover:text-orange-600 transition-colors">
              سیڤیی من
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>دروستکراوە بە</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>بۆ گەنجانی داهاتوو لە کوردستان</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
