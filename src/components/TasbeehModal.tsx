import React, { useState } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeColor } from '../types';
import { playBeadClick, playCompletionChime, triggerHaptic } from '../utils/audio';

interface TasbeehModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: ThemeColor;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const PRESET_PHRASES = [
  'سُبْحَانَ اللَّهِ',
  'الحَمْدُ لِلَّهِ',
  'اللَّهُ أَكْبَرُ',
  'لاَ إِلَهَ إِلاَّ اللَّهُ',
  'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
  'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
  'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
];

export const TasbeehModal: React.FC<TasbeehModalProps> = ({
  isOpen,
  onClose,
  themeColor,
  soundEnabled,
  onToggleSound,
}) => {
  const [selectedPhrase, setSelectedPhrase] = useState(PRESET_PHRASES[0]);
  const [target, setTarget] = useState<number>(33);
  const [count, setCount] = useState<number>(0);
  const [totalToday, setTotalToday] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasbeeh_total_today');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  if (!isOpen) return null;

  const isCompleted = target > 0 && count >= target;

  const handleTap = () => {
    const nextCount = count + 1;
    setCount(nextCount);

    const nextTotal = totalToday + 1;
    setTotalToday(nextTotal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasbeeh_total_today', nextTotal.toString());
    }

    if (soundEnabled) {
      if (target > 0 && nextCount === target) {
        playCompletionChime();
      } else {
        playBeadClick();
      }
    }

    triggerHaptic(target > 0 && nextCount === target ? 50 : 25);
  };

  const handleReset = () => {
    setCount(0);
  };

  const progress = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 font-amiri">
              السبحة الإلكترونية التفاعلية
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
              aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-center">
          
          {/* Preset Phrases dropdown / horizontal scroll */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              اختر صيغة الذكر:
            </label>
            <select
              value={selectedPhrase}
              onChange={e => {
                setSelectedPhrase(e.target.value);
                setCount(0);
              }}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold outline-hidden cursor-pointer"
            >
              {PRESET_PHRASES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Current Displayed Dhikr Phrase */}
          <div className="py-2">
            <div className="text-2xl sm:text-3xl font-bold font-uthmani text-stone-900 dark:text-stone-50 min-h-[3rem] flex items-center justify-center">
              {selectedPhrase}
            </div>
          </div>

          {/* Main Tap Counter Button */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              {/* Outer SVG progress circle */}
              <svg className="w-56 h-56 transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="98"
                  className="stroke-stone-200 dark:stroke-stone-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="98"
                  className={`transition-all duration-200 ${
                    isCompleted 
                      ? 'stroke-emerald-500' 
                      : themeColor === 'emerald' ? 'stroke-emerald-600' : 'stroke-indigo-600'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 98}
                  strokeDashoffset={2 * Math.PI * 98 * (1 - progress / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Tap button in center */}
              <button
                onClick={handleTap}
                aria-label={`تسبيح، العدد الحالي ${count}`}
                className={`absolute inset-4 rounded-full flex flex-col items-center justify-center shadow-inner cursor-pointer active:scale-95 transition-all select-none ${
                  isCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : themeColor === 'emerald'
                      ? 'bg-gradient-to-br from-emerald-700 to-emerald-900 text-white hover:from-emerald-600 hover:to-emerald-800'
                      : 'bg-gradient-to-br from-indigo-700 to-indigo-900 text-white hover:from-indigo-600 hover:to-indigo-800'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 mb-1" />
                    <span className="text-base font-bold">تم بحمد الله</span>
                    <span className="text-xs opacity-80 font-mono mt-1">{count} / {target}</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl sm:text-5xl font-bold font-mono tracking-wider tabular-nums">
                      {count}
                    </span>
                    <span className="text-xs font-medium opacity-85 mt-1">
                      {target > 0 ? `المستهدف: ${target}` : 'عداد مفتوح'}
                    </span>
                    <span className="text-[11px] opacity-70 mt-0.5">اضغط للعد</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Target options & Reset button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
              {[33, 100, 0].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    setTarget(val);
                    setCount(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    target === val
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {val === 0 ? 'مفتوح' : `${val}`}
                </button>
              ))}
            </div>

            <button
              onClick={handleReset}
              title="تصفير العداد"
              aria-label="تصفير العداد"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          </div>

          {/* Daily Total Counter */}
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>إجمالي تسبيحاتك اليوم:</span>
            </span>
            <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm tabular-nums">
              {totalToday}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
