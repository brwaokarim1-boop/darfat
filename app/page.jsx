import Link from "next/link";
import { 
  Users, 
  Award, 
  Search, 
  Calendar, 
  MapPin, 
  Briefcase 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPPORTUNITY_TYPES } from "@/lib/constants";

export default function HomePage() {
  const sampleOpportunities = [
    {
      id: "1",
      title: "هاکاسۆنی پڕۆگرامسازی بۆ لاوانی کوردستان",
      type: "hackathon",
      organizer: "دەزگای تەکنەلۆژیای هەولێر",
      location: "هەولێر",
      date: "١٥ تشرینی دووەم ٢٠٢٦",
      skills: ["React", "Python", "UI/UX"],
    },
    {
      id: "2",
      title: "فیستیڤاڵی گەنجانی داهێنەر",
      type: "volunteer",
      organizer: "ڕێکخراوی گەشەی لاوان",
      location: "سلێمانی",
      date: "٢٠ تشرینی دووەم ٢٠٢٦",
      skills: ["سەرکردایەتی", "ڕێکخستن", "پەیوەندییەکان"],
    },
    {
      id: "3",
      title: "وۆرکشۆپی پەرەپێدانی ئەپڵیکەیشنی مۆبایل و دیزاین",
      type: "workshop",
      organizer: "ناوەندی گەشەپێدانی دهۆک",
      location: "دهۆک (ئۆنلاین)",
      date: "٢٨ تشرینی دووەم ٢٠٢٦",
      skills: ["Figma", "Mobile UI", "Next.js"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="pt-16 pb-16 md:pt-24 md:pb-24 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            پلاتفۆرمی دەرفەتەکان بۆ لاوان
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            دەرفەتی کار، هاکاسۆن، و وۆرکشۆپەکان بدۆزەرەوە. چالاکییەکانت تۆمار بکە و سیڤییەکی پیشەیی دروست بکە بۆ داهاتووت.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto px-8">
                چوونە ژوورەوە
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                <Search className="w-4 h-4 ms-2" />
                گەڕان
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            خزمەتگوزارییەکانمان
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">دۆزینەوەی دەرفەت</h3>
              <p className="text-slate-600 text-sm">
                بەدوای ئەو چالاکییانەدا بگەڕێ کە دەگونجێن لەگەڵ کات و ئارەزووەکانت.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">دۆزینەوەی هاوتیم</h3>
              <p className="text-slate-600 text-sm">
                کەسانی خاوەن کارامەیی جیاواز بدۆزەرەوە بۆ ئەنجامدانی پڕۆژە هاوبەشەکان.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">دروستکردنی سیڤی</h3>
              <p className="text-slate-600 text-sm">
                هەموو بەشدارییەکانت تۆمار بکە و وەک بەڵگەیەک لە سیڤییەکەتدا بەکاریان بهێنە.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities List */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">نوێترین دەرفەتەکان</h2>
            <Link href="/opportunities" className="text-blue-600 hover:underline text-sm font-medium">
              بینینی هەمووی
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleOpportunities.map((item) => {
              const typeConfig = OPPORTUNITY_TYPES ? OPPORTUNITY_TYPES[item.type] : null;
              
              return (
                <div key={item.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="mb-3">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {typeConfig ? typeConfig.label : item.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-4 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="space-y-2 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{item.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/opportunities`} className="block">
                    <Button variant="secondary" className="w-full">
                      وردەکاری زیاتر
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ئێستا دەست پێبکە
          </h2>
          <p className="text-slate-400 mb-8">
            خۆت تۆمار بکە و دەست بکە بە گەڕان بۆ دۆزینەوەی ئەو دەرفەتانەی گونجاون بۆت.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8">
              خۆت تۆمار بکە
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
