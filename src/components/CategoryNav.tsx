import React from 'react';
import { 
  BookOpen, 
  Sun, 
  Moon, 
  Sparkles, 
  Compass, 
  HeartHandshake, 
  Coffee, 
  ShieldPlus, 
  MapPin, 
  Award,
  Bookmark
} from 'lucide-react';
import { CATEGORIES } from '../data/azkarData';
import { CategoryId, ThemeColor } from '../types';

interface CategoryNavProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  themeColor: ThemeColor;
  countsByCategory: Record<string, number>;
  isFavoritesActive: boolean;
  onSelectFavorites: () => void;
  favoritesCount: number;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Compass,
  HeartHandshake,
  Coffee,
  ShieldPlus,
  MapPin,
  Award,
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  themeColor,
  countsByCategory,
  isFavoritesActive,
  onSelectFavorites,
  favoritesCount,
}) => {
  return (
    <div className="w-full border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 sticky top-18 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          
          {/* Favorites Tab Button */}
          <button
            onClick={onSelectFavorites}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
              isFavoritesActive
                ? themeColor === 'emerald'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-200 border border-sky-300 dark:border-sky-700 shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavoritesActive ? 'fill-current' : ''}`} />
            <span>المفضلة</span>
            <span className="text-xs px-1.5 py-0.2 rounded-md bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 tabular-nums">
              {favoritesCount}
            </span>
          </button>

          <div className="h-5 w-px bg-stone-200 dark:bg-stone-800 shrink-0 mx-1" aria-hidden="true" />

          {/* Standard Categories */}
          {CATEGORIES.map(category => {
            const Icon = ICON_MAP[category.iconName] || BookOpen;
            const isSelected = !isFavoritesActive && selectedCategory === category.id;
            const count = countsByCategory[category.id] || 0;

            const activeClass = themeColor === 'emerald'
              ? 'bg-emerald-800 text-white dark:bg-emerald-700 dark:text-emerald-50 shadow-xs'
              : 'bg-indigo-800 text-white dark:bg-indigo-700 dark:text-indigo-50 shadow-xs';

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? activeClass
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-85" />
                <span className="whitespace-nowrap">{category.title}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md tabular-nums ${
                  isSelected 
                    ? 'bg-black/20 text-white' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};
