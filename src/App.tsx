/**
 * جامع صحيح الأذكار - للإمام المحدث محمد ناصر الدين الألباني رحمه الله
 * تطبيق ويب قياسي تفاعلي مستخرج ومطابق للكتاب الأصلي
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Sun, 
  Moon, 
  Bell, 
  Sparkles, 
  Layers, 
  Bookmark, 
  HelpCircle,
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { DhikrCard } from './components/DhikrCard';
import { NotificationModal } from './components/NotificationModal';
import { BookInfoModal } from './components/BookInfoModal';
import { TasbeehModal } from './components/TasbeehModal';
import { Footer } from './components/Footer';
import { CATEGORIES, AZKAR_ITEMS, DEFAULT_REMINDERS } from './data/azkarData';
import { CategoryId, ThemeColor, ThemeMode, ReminderConfig } from './types';
import { matchesQuery } from './utils/search';
import { playReminderChime } from './utils/audio';

export default function App() {
  // Theme state
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('azkar_theme_color');
      return (saved === 'sapphire' || saved === 'emerald') ? saved : 'emerald';
    }
    return 'emerald';
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('azkar_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Reading preferences
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('azkar_font_size');
      return saved ? parseInt(saved, 10) : 21;
    }
    return 21;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('azkar_sound');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [vibrationEnabled] = useState<boolean>(true);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('azkar_favorites');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Reminders state
  const [reminders, setReminders] = useState<ReminderConfig[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('azkar_reminders');
        return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
      } catch {
        return DEFAULT_REMINDERS;
      }
    }
    return DEFAULT_REMINDERS;
  });

  // Navigation & Search
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [isFavoritesActive, setIsFavoritesActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isBookInfoModalOpen, setIsBookInfoModalOpen] = useState(false);
  const [isTasbeehModalOpen, setIsTasbeehModalOpen] = useState(false);

  // Active in-app reminder banner
  const [currentTriggeredReminder, setCurrentTriggeredReminder] = useState<ReminderConfig | null>(null);

  const categoriesRef = useRef<HTMLDivElement>(null);

  // Synchronize <html> classes for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('azkar_theme_mode', themeMode);
  }, [themeMode]);

  // Save theme color to local storage
  useEffect(() => {
    localStorage.setItem('azkar_theme_color', themeColor);
  }, [themeColor]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('azkar_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save font size
  useEffect(() => {
    localStorage.setItem('azkar_font_size', fontSize.toString());
  }, [fontSize]);

  // Save sound setting
  useEffect(() => {
    localStorage.setItem('azkar_sound', soundEnabled.toString());
  }, [soundEnabled]);

  // Save reminders
  const handleUpdateReminders = (updated: ReminderConfig[]) => {
    setReminders(updated);
    localStorage.setItem('azkar_reminders', JSON.stringify(updated));
  };

  // Background reminder scheduler check (runs every 30s)
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;

      reminders.forEach(reminder => {
        if (reminder.enabled && reminder.time === currentTimeStr) {
          // Avoid duplicate triggers in the same minute
          const lastTriggerKey = `azkar_last_trigger_${reminder.id}_${now.toDateString()}_${currentTimeStr}`;
          if (!sessionStorage.getItem(lastTriggerKey)) {
            sessionStorage.setItem(lastTriggerKey, 'true');
            setCurrentTriggeredReminder(reminder);
            if (soundEnabled) {
              playReminderChime();
            }
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(`تذكير: ${reminder.title}`, {
                  body: reminder.description,
                  icon: '/favicon.ico',
                });
              } catch {
                // Ignore
              }
            }
          }
        }
      });
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 30000);
    return () => clearInterval(interval);
  }, [reminders, soundEnabled]);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Switch category
  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setIsFavoritesActive(false);
  };

  // Switch to favorites tab
  const handleSelectFavorites = () => {
    setIsFavoritesActive(true);
  };

  // Counts by category
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: AZKAR_ITEMS.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = AZKAR_ITEMS.filter(item => item.category === cat.id).length;
      }
    });
    return counts;
  }, []);

  // Filtered Dhikr items based on search and selected category
  const filteredItems = useMemo(() => {
    let items = AZKAR_ITEMS;

    if (isFavoritesActive) {
      items = items.filter(item => favorites.includes(item.id));
    } else if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      items = items.filter(item => 
        matchesQuery(
          searchQuery,
          item.text,
          item.chapterTitle,
          item.narrator,
          item.reward,
          item.source,
          item.albaniNotes
        )
      );
    }

    return items;
  }, [selectedCategory, isFavoritesActive, favorites, searchQuery]);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Selected Category Meta
  const activeCategoryMeta = isFavoritesActive 
    ? {
        id: 'favorites',
        title: 'الأذكار المفضلة',
        description: 'قائمتك الشخصية من الأذكار التي قمت بحفظها للرجوع السريع إليها',
      }
    : CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  const quickSearchTags = [
    'سيد الاستغفار',
    'آية الكرسي',
    'ما يقال عند النوم',
    'الهم والحزن',
    'كفارة المجلس',
    'رقية المريض',
    'دعاء السفر',
    'اسم الله الأعظم',
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-amber-200 dark:selection:bg-amber-900 ${
      themeColor === 'emerald' ? 'theme-emerald' : 'theme-sapphire'
    }`}>
      
      {/* 1. Header with Top Bar Contract */}
      <Header
        themeColor={themeColor}
        onToggleThemeColor={() => setThemeColor(prev => prev === 'emerald' ? 'sapphire' : 'emerald')}
        themeMode={themeMode}
        onToggleThemeMode={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
        favoritesCount={favorites.length}
        onOpenFavorites={handleSelectFavorites}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenBookInfo={() => setIsBookInfoModalOpen(true)}
        onOpenTasbeeh={() => setIsTasbeehModalOpen(true)}
        onScrollToCategories={scrollToCategories}
        hasActiveNotifications={reminders.some(r => r.enabled)}
      />

      {/* Triggered In-App Reminder Banner (if alarm fired) */}
      {currentTriggeredReminder && (
        <div className="bg-amber-500 text-stone-950 px-4 py-3 shadow-md animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 animate-bounce shrink-0" />
              <div>
                <strong className="text-sm font-bold">حان موعد: {currentTriggeredReminder.title}!</strong>
                <span className="text-xs mr-2 opacity-90 hidden sm:inline">{currentTriggeredReminder.description}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleSelectCategory(currentTriggeredReminder.categoryLink);
                  setCurrentTriggeredReminder(null);
                  scrollToCategories();
                }}
                className="px-3 py-1 rounded-lg bg-stone-950 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                قراءة أذكارها الآن
              </button>
              <button
                onClick={() => setCurrentTriggeredReminder(null)}
                aria-label="إغلاق التنبيه"
                className="p-1 rounded-md hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className={`relative overflow-hidden border-b border-stone-200 dark:border-stone-800 py-12 sm:py-16 transition-colors ${
          themeColor === 'emerald'
            ? 'bg-gradient-to-b from-emerald-950/10 via-emerald-900/5 to-transparent dark:from-emerald-950/30 dark:via-stone-900 dark:to-stone-950'
            : 'bg-gradient-to-b from-indigo-950/10 via-indigo-900/5 to-transparent dark:from-indigo-950/30 dark:via-stone-900 dark:to-stone-950'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Hero Prose */}
              <div className="lg:col-span-7 space-y-4 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>النسخة التفاعلية الكاملة المعتمدة من تحقيقات العلامة الألباني</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-amiri text-stone-900 dark:text-stone-50 break-words leading-tight">
                  جامع صحيح الأذكار
                  <span className={`block text-xl sm:text-3xl lg:text-4xl mt-2 font-normal ${
                    themeColor === 'emerald' ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-700 dark:text-indigo-400'
                  }`}>
                    للإمام المحدث محمد ناصر الدين الألباني
                  </span>
                </h1>

                <p className="text-xs sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl break-words">
                  موسوعة الأذكار والأدعية النبوية الصحيحة المستخرجة بدقة من كتب الإمام الألباني رحمه الله، مع الالتزام بالدليل اللوني المعتمد وتخريج كل حديث، لتيسير حفظ الأذكار وترديدها يومياً بكل يسر وسكينة.
                </p>

                {/* Quick Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={() => {
                      handleSelectCategory('sabah_masaa');
                      scrollToCategories();
                    }}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs transition-all cursor-pointer ${
                      themeColor === 'emerald'
                        ? 'bg-emerald-700 hover:bg-emerald-800'
                        : 'bg-indigo-700 hover:bg-indigo-800'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-300" />
                    <span>أذكار الصباح والمساء</span>
                  </button>

                  <button
                    onClick={() => {
                      handleSelectCategory('sleep_wake');
                      scrollToCategories();
                    }}
                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 transition-all cursor-pointer shadow-xs"
                  >
                    <Moon className="w-4 h-4 text-sky-400" />
                    <span>أذكار النوم والليل</span>
                  </button>

                  <button
                    onClick={() => setIsTasbeehModalOpen(true)}
                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-stone-950 transition-all cursor-pointer shadow-xs"
                  >
                    <span>فتح السبحة الإلكترونية</span>
                  </button>
                </div>
              </div>

              {/* Hero Status & Highlights Card */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-lg space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                      مميزات النسخة الرقمية
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      مرحلة أولى مكتملة
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                      <div className="text-2xl font-extrabold font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                        {AZKAR_ITEMS.length}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        ذكر وحديث صحيح موثق
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                      <div className="text-2xl font-extrabold font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                        {CATEGORIES.length - 1}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        أبواب وتبويبات شاملة
                      </div>
                    </div>
                  </div>

                  {/* Daily Reminder Quick Status */}
                  <div 
                    onClick={() => setIsNotificationModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 dark:hover:bg-amber-950/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                      <div className="text-xs text-amber-900 dark:text-amber-200">
                        <strong className="block">نظام التنبيهات اليومية</strong>
                        <span>{reminders.filter(r => r.enabled).length} تنبيهات مفعلة حالياً</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      تعديل ←
                    </span>
                  </div>

                  {/* 4-Color Methodology Indicator */}
                  <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                    <span>منهج الألوان:</span>
                    <div className="flex items-center gap-3 font-semibold">
                      <span className="text-blue-600 dark:text-blue-400">● الذكر</span>
                      <span className="text-red-600 dark:text-red-400">● التكرار</span>
                      <span className="text-emerald-600 dark:text-emerald-400">● الفضل</span>
                      <span className="text-amber-700 dark:text-amber-400">● التخريج</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Categories Tab Navigation */}
        <div ref={categoriesRef}>
          <CategoryNav
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            themeColor={themeColor}
            countsByCategory={countsByCategory}
            isFavoritesActive={isFavoritesActive}
            onSelectFavorites={handleSelectFavorites}
            favoritesCount={favorites.length}
          />
        </div>

        {/* Search, Font Controls, and Filters Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث في نصوص الأذكار، الأبواب، الصحابة، أو التخريج..."
                className="w-full pr-11 pl-10 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Reading Customization Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              
              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs">
                <span className="px-2 text-stone-500 dark:text-stone-400 font-medium">حجم الخط:</span>
                <button
                  onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
                  aria-label="تصغير الخط"
                  className="w-7 h-7 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  أ-
                </button>
                <span className="font-mono text-stone-800 dark:text-stone-200 px-1 font-bold">
                  {fontSize}
                </span>
                <button
                  onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                  aria-label="تكبير الخط"
                  className="w-7 h-7 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  أ+
                </button>
              </div>

              {/* Sound Feedback Toggle */}
              <button
                onClick={() => setSoundEnabled(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-stone-200 bg-white text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400'
                }`}
                title={soundEnabled ? 'صوت التسبيح مفعّل' : 'صوت التسبيح صامت'}
              >
                <span>{soundEnabled ? 'الصوت: مفعّل' : 'الصوت: صامت'}</span>
              </button>

            </div>

          </div>

          {/* Quick Search Chips */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
            <span className="text-stone-400 shrink-0 ml-1">اقتراحات سريعة:</span>
            {quickSearchTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Active Category Heading & Results Count */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 font-amiri">
                {activeCategoryMeta.title}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {activeCategoryMeta.description}
              </p>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span>عدد الأذكار المعروضة: </span>
              <strong className="text-stone-800 dark:text-stone-200 font-mono text-sm tabular-nums">
                {filteredItems.length}
              </strong>
            </div>
          </div>

          {/* Dhikr Cards Grid */}
          {filteredItems.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {filteredItems.map(item => (
                <DhikrCard
                  key={item.id}
                  item={item}
                  themeColor={themeColor}
                  fontSize={fontSize}
                  soundEnabled={soundEnabled}
                  vibrationEnabled={vibrationEnabled}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={handleToggleFavorite}
                  showTashkeel={true}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="mt-12 text-center py-16 px-4 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 bg-white/50 dark:bg-stone-900/40 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                لا توجد نتائج مطابقة
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {isFavoritesActive 
                  ? 'لم تقم بإضافة أي أذكار إلى المفضلة بعد. اضغط على أيقونة الإشارة المرجعية لحفظ الأذكار.'
                  : `لم نعثر على أذكار تطابق "${searchQuery}". جرب كلمة بحث أخرى أو تصفح الأبواب مباشرة.`
                }
              </p>
              {(searchQuery || isFavoritesActive) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsFavoritesActive(false);
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer"
                >
                  عرض جميع الأذكار
                </button>
              )}
            </div>
          )}

        </div>

      </main>

      {/* Floating Fast Action: Digital Subha / Counter */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          onClick={() => setIsTasbeehModalOpen(true)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            themeColor === 'emerald'
              ? 'bg-emerald-800 hover:bg-emerald-700'
              : 'bg-indigo-800 hover:bg-indigo-700'
          }`}
          title="فتح السبحة الإلكترونية"
        >
          <span className="text-xs sm:text-sm font-bold">السبحة الإلكترونية</span>
        </button>
      </div>

      {/* Modals */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        reminders={reminders}
        onUpdateReminders={handleUpdateReminders}
        themeColor={themeColor}
      />

      <BookInfoModal
        isOpen={isBookInfoModalOpen}
        onClose={() => setIsBookInfoModalOpen(false)}
        themeColor={themeColor}
      />

      <TasbeehModal
        isOpen={isTasbeehModalOpen}
        onClose={() => setIsTasbeehModalOpen(false)}
        themeColor={themeColor}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />

      {/* Footer */}
      <Footer
        themeColor={themeColor}
        onOpenBookInfo={() => setIsBookInfoModalOpen(true)}
      />

    </div>
  );
}
