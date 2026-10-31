import React, { useState } from 'react';
import { 
  Bookmark, 
  Copy, 
  Check, 
  RotateCcw, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DhikrItem, ThemeColor } from '../types';
import { playBeadClick, playCompletionChime, triggerHaptic } from '../utils/audio';

interface DhikrCardProps {
  item: DhikrItem;
  themeColor: ThemeColor;
  fontSize: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  showTashkeel: boolean;
}

export const DhikrCard: React.FC<DhikrCardProps> = ({
  item,
  themeColor,
  fontSize,
  soundEnabled,
  vibrationEnabled,
  isFavorite,
  onToggleFavorite,
}) => {
  const [currentCount, setCurrentCount] = useState<number>(item.count);
  const [copied, setCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const isCompleted = currentCount === 0;

  const handleCountClick = () => {
    if (isCompleted) {
      // If already completed, reset on tap
      setCurrentCount(item.count);
      return;
    }

    const nextCount = currentCount - 1;
    setCurrentCount(nextCount);

    if (soundEnabled) {
      if (nextCount === 0) {
        playCompletionChime();
      } else {
        playBeadClick();
      }
    }

    if (vibrationEnabled) {
      triggerHaptic(nextCount === 0 ? 50 : 25);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentCount(item.count);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${item.chapterTitle}\n\n${item.narrator ? item.narrator + ':\n' : ''}${item.text}\n\nالتكرار: ${item.countLabel}\n${item.reward ? 'الفضل: ' + item.reward + '\n' : ''}التخريج: ${item.source}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: item.chapterTitle,
      text: `${item.text}\n\n${item.source}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopy(e);
    }
  };

  // Progress percentage
  const progressPercent = item.count > 0 
    ? Math.round(((item.count - currentCount) / item.count) * 100) 
    : 100;

  return (
    <article 
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isCompleted 
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs' 
          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs'
      }`}
    >
      {/* Top Header Strip: Chapter title & actions */}
      <div className="px-5 py-3 border-b border-stone-100 dark:border-stone-800/60 flex items-center justify-between gap-3 bg-stone-50/50 dark:bg-stone-900/50">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums shrink-0 ${
            themeColor === 'emerald'
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/70 dark:text-emerald-200'
              : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/70 dark:text-indigo-200'
          }`}>
            {item.number}
          </span>
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
            {item.chapterTitle}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0 text-stone-500 dark:text-stone-400">
          <button
            onClick={handleCopy}
            title="نسخ الذكر"
            aria-label="نسخ الذكر"
            className="p-1.5 rounded-md hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            title="مشاركة"
            aria-label="مشاركة الذكر"
            className="p-1.5 rounded-md hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFavorite(item.id)}
            title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            className={`p-1.5 rounded-md hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors ${
              isFavorite ? 'text-amber-500 fill-amber-500' : ''
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Narrator (if present) */}
        {item.narrator && (
          <p className="text-xs sm:text-sm font-medium text-stone-500 dark:text-stone-400">
            {item.narrator}
          </p>
        )}

        {/* 1. نص الذكر (Blue color as defined in Book page 11) */}
        <div 
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
          className="font-uthmani text-blue-800 dark:text-blue-300 font-semibold tracking-wide selection:bg-blue-200 dark:selection:bg-blue-900"
        >
          {item.text}
        </div>

        {/* 2. تكرار الذكر والعداد التفاعلي (Red color as in Book page 11) */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800/60">
          
          <div className="flex items-center gap-2.5">
            {/* Interactive Counter Button */}
            <button
              onClick={handleCountClick}
              disabled={item.count <= 1 && isCompleted}
              aria-label={`تكرار الذكر، المتبقي ${currentCount} من ${item.count}`}
              className={`group flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span className="text-sm">اكتمل التكرار</span>
                </>
              ) : (
                <>
                  <span className="text-xs text-red-600/80 dark:text-red-400">اضغط للعد:</span>
                  <span className="text-base sm:text-lg font-mono tabular-nums">
                    {currentCount}
                  </span>
                  <span className="text-xs text-red-500/70">/ {item.count}</span>
                </>
              )}
            </button>

            {/* Reset Button */}
            {currentCount !== item.count && (
              <button
                onClick={handleReset}
                title="إعادة ضبط العداد"
                aria-label="إعادة ضبط العداد"
                className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Text repetition label (Red) */}
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <span>التكرار:</span>
            <span>{item.countLabel}</span>
          </div>

        </div>

        {/* Progress Bar */}
        {item.count > 1 && (
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isCompleted 
                  ? 'bg-emerald-500' 
                  : themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* 3. فضل الذكر (Green color as in Book page 11) */}
        {item.reward && (
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm leading-relaxed">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold ml-1">فضل الذكر:</span>
                <span>{item.reward}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. تخريج الحديث (Olive / Brown as in Book page 11) */}
        <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">التخريج:</span>
            <span>{item.source}</span>
          </div>

          {/* Toggle Albani notes */}
          {item.albaniNotes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span>فوائد وتعليقات الشيخ</span>
              {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Collapsible Sheikh Al-Albani Commentary */}
        {showNotes && item.albaniNotes && (
          <div className="p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed space-y-1">
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>قال الإمام الألباني رحمه الله:</span>
            </div>
            <p className="whitespace-pre-line">{item.albaniNotes}</p>
          </div>
        )}

      </div>
    </article>
  );
};
