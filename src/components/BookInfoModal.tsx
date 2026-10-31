import React from 'react';
import { X, BookOpen, CheckCircle, Sparkles, Palette } from 'lucide-react';
import { ThemeColor } from '../types';

interface BookInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: ThemeColor;
}

export const BookInfoModal: React.FC<BookInfoModalProps> = ({
  isOpen,
  onClose,
  themeColor,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              themeColor === 'emerald'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 font-amiri">
                كتاب: جامع صحيح الأذكار
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                من كتب وتحقيقات العلامة المحدث محمد ناصر الدين الألباني رحمه الله
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          
          {/* Card: Author & Compiler */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-1.5">
            <div className="font-bold text-stone-900 dark:text-stone-100">
              بطاقة الكتاب الأصلي المرفق:
            </div>
            <ul className="text-xs space-y-1 text-stone-600 dark:text-stone-400">
              <li>• <strong className="text-stone-800 dark:text-stone-200">تحقيق وتصحيح:</strong> العلامة المحدث محمد ناصر الدين الألباني (ت: 1420هـ) رحمه الله تعالى.</li>
              <li>• <strong className="text-stone-800 dark:text-stone-200">جمع وترتيب:</strong> أبو الحسن محمد بن حسن بن عبد الحميد الشيخ.</li>
              <li>• <strong className="text-stone-800 dark:text-stone-200">الغاية:</strong> تيسير الأذكار الصحيحة الثابتة وتسهيل تذكير المسلمين بها ودفع البدع والمحدثات.</li>
            </ul>
          </div>

          {/* Color methodology as in Page 11 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>منهج الألوان المعتمد في التطبيق والكتاب (صفحة 11):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shrink-0"></span>
                <div>
                  <strong className="text-blue-900 dark:text-blue-200">اللون الأزرق:</strong>
                  <div className="text-stone-600 dark:text-stone-400">مخصص لنص الذكر النبوي المبارك.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 shrink-0"></span>
                <div>
                  <strong className="text-red-900 dark:text-red-200">اللون الأحمر:</strong>
                  <div className="text-stone-600 dark:text-stone-400">مخصص لعدد تكرار الذكر والعداد التفاعلي.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0"></span>
                <div>
                  <strong className="text-emerald-900 dark:text-emerald-200">اللون الأخضر:</strong>
                  <div className="text-stone-600 dark:text-stone-400">مخصص لفضل الذكر وثوابه المترتب عليه.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-700 shrink-0"></span>
                <div>
                  <strong className="text-amber-900 dark:text-amber-200">اللون الزيتوني / البني:</strong>
                  <div className="text-stone-600 dark:text-stone-400">مخصص لتخريج الحديث في كتب الشيخ.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rules from Preface */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>قواعد منهج الجمع والتحقيق:</span>
            </div>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-stone-600 dark:text-stone-400 leading-normal">
              <li>ذكر تحت كل حديث مصدراً أو مصدرين من كتب العلامة لمن أراد الوقوف على الفوائد والشوارد.</li>
              <li>الاقتصار التام على ما صححه الإمام الألباني رحمه الله في كتبه المطبوعة.</li>
              <li>نقل الحديث كاملاً مع ذكر الصحابي والأجر المترتب ليكون حافزاً ومشجعاً.</li>
              <li>الاعتناء بتراجعات العلامة رحمه الله في كتبه وتصحيحاته المتأخرة.</li>
              <li>وضع تعليقات وتنبيهات الإمام الألباني لبيان السنن المهجورة والتحذير من البدع والمحدثات.</li>
            </ul>
          </div>

          {/* Hosting Guide */}
          <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              جاهزية الاستضافة في أي مكان:
            </span>
            <p className="text-stone-600 dark:text-stone-400">
              هذا البرنامج مبرمج بتقنيات الويب القياسية (HTML5 + CSS + JavaScript/React) كصفحة واحدة SPA مستقلة لا تحتاج لأي خادم خلفي، ويمكن بناؤها بالأمر <code className="bg-stone-200 dark:bg-stone-900 px-1 py-0.5 rounded">npm run build</code> ورفع مجلد <code className="bg-stone-200 dark:bg-stone-900 px-1 py-0.5 rounded">dist</code> لأي استضافة ويب (Netlify, Vercel, GitHub Pages, Apache, Nginx, cPanel).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs cursor-pointer ${
              themeColor === 'emerald'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-indigo-700 hover:bg-indigo-800'
            }`}
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
