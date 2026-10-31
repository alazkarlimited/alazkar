import React from 'react';
import { BookOpen, ShieldCheck, Globe, Heart } from 'lucide-react';
import { ThemeColor } from '../types';

interface FooterProps {
  themeColor: ThemeColor;
  onOpenBookInfo: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  themeColor,
  onOpenBookInfo,
}) => {
  return (
    <footer className="mt-16 border-t border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                themeColor === 'emerald'
                  ? 'bg-emerald-800 text-amber-300 dark:bg-emerald-700'
                  : 'bg-indigo-800 text-sky-200 dark:bg-indigo-700'
              }`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-stone-900 dark:text-stone-100 font-amiri text-lg">
                جامع صحيح الأذكار
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              تطبيق إسلامي تفاعلي يستند حرفياً إلى كتاب «جامع صحيح الأذكار» للإمام المحدث محمد ناصر الدين الألباني رحمه الله تعالى، جمع وترتيب أبي الحسن الشيخ، وفق تصحيحات وتخريجات الشيخ المعتمدة.
            </p>
          </div>

          {/* Col 2: Hosting Readiness */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>جاهز للاستضافة والنشر (Web Standards)</span>
            </h4>
            <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              مبرمج كصفحة واحدة تفاعلية خفيفة (Static React + Tailwind) يمكن نشرها مجاناً على أي مزود استضافة (GitHub Pages, Netlify, Vercel, Firebase Hosting, Cloudflare Pages, cPanel) عبر تشغيل أمر البناء <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-[11px]">npm run build</code>.
            </p>
          </div>

          {/* Col 3: Privacy & Offline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>خصوصية تامة وعمل دون إنترنت</span>
            </h4>
            <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              جميع التفضيلات، العدادات، التنبيهات، والمفضلة تُحفظ محلياً على جهاز المستخدم (Local Storage) ولا تُرسل أي بيانات إلى أي خوادم خارجية.
            </p>
            <button
              onClick={onOpenBookInfo}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline inline-block mt-1 cursor-pointer font-medium"
            >
              عرض مقدمة الكتاب وفهرس المراجع ←
            </button>
          </div>

        </div>

        <div className="pt-6 border-t border-stone-200 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <span>صدقة جارية نفع الله بها المسلمين</span>
            <span>·</span>
            <span>غفر الله للشيخ الألباني ولجامعه وقارئه وناشره</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>صُنع بإتقان</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>لتيسير ذكر الله</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
