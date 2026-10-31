import React from 'react';
import { 
  BookOpen, 
  Bell, 
  Bookmark, 
  Moon, 
  Sun, 
  Palette, 
  Info, 
  Layers
} from 'lucide-react';
import { ThemeColor, ThemeMode } from '../types';

interface HeaderProps {
  themeColor: ThemeColor;
  onToggleThemeColor: () => void;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenNotifications: () => void;
  onOpenBookInfo: () => void;
  onOpenTasbeeh: () => void;
  onScrollToCategories: () => void;
  hasActiveNotifications: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  themeColor,
  onToggleThemeColor,
  themeMode,
  onToggleThemeMode,
  favoritesCount,
  onOpenFavorites,
  onOpenNotifications,
  onOpenBookInfo,
  onOpenTasbeeh,
  onScrollToCategories,
  hasActiveNotifications,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-50/90 dark:bg-stone-950/90 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
              themeColor === 'emerald'
                ? 'bg-emerald-800 text-amber-300 dark:bg-emerald-700 dark:text-amber-200'
                : 'bg-indigo-800 text-sky-200 dark:bg-indigo-700 dark:text-sky-100'
            }`}>
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-amiri leading-none">
                جامع صحيح الأذكار
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:block mt-0.5">
                للإمام المحدث محمد ناصر الدين الألباني
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line prose links) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button 
            onClick={onScrollToCategories}
            className="hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Layers className="w-4 h-4 opacity-75" />
            <span>الأبواب والتبويبات</span>
          </button>

          <button 
            onClick={onOpenTasbeeh}
            className="hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>السبحة الإلكترونية</span>
          </button>

          <button 
            onClick={onOpenFavorites}
            className="hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Bookmark className="w-4 h-4 opacity-75" />
            <span>المفضلة</span>
            {favoritesCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold tabular-nums">
                {favoritesCount}
              </span>
            )}
          </button>

          <button 
            onClick={onOpenNotifications}
            className="hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Bell className="w-4 h-4 opacity-75" />
            <span>التنبيهات اليومية</span>
            {hasActiveNotifications && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                مفعل
              </span>
            )}
          </button>

          <button 
            onClick={onOpenBookInfo}
            className="hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Info className="w-4 h-4 opacity-75" />
            <span>عن الكتاب ومنهجه</span>
          </button>
        </nav>

        {/* Zone 3: Interactive Controls (Theme Color, Dark Mode, Quick Mobile Actions) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Mobile Favorites Trigger */}
          <button
            onClick={onOpenFavorites}
            aria-label="المفضلة"
            className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors relative"
          >
            <Bookmark className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          {/* Mobile Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            aria-label="التنبيهات"
            className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {hasActiveNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {/* Theme Palette Switcher (Emerald vs Sapphire) */}
          <button
            onClick={onToggleThemeColor}
            aria-label={`تغيير اللون إلى النمط ${themeColor === 'emerald' ? 'النيلي اللازوردي' : 'الزمردي الأندلسي'}`}
            title={`النمط اللوني الحالي: ${themeColor === 'emerald' ? 'الزمردي الملكي' : 'الأزرق اللازوردي'}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors text-xs font-medium cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">
              {themeColor === 'emerald' ? 'الزمردي' : 'اللازوردي'}
            </span>
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={onToggleThemeMode}
            aria-label={themeMode === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            title={themeMode === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNotifications}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
              themeColor === 'emerald'
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500'
                : 'bg-indigo-700 hover:bg-indigo-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>ضبط التنبيه اليومي</span>
          </button>

        </div>

      </div>
    </header>
  );
};
