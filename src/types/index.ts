export type ThemeColor = 'emerald' | 'sapphire';
export type ThemeMode = 'light' | 'dark';

export interface DhikrItem {
  id: string;
  number: number;
  chapterNumber?: number;
  chapterTitle: string;
  category: CategoryId;
  narrator?: string; // الصحابي (e.g. عن أبي هريرة رضي الله عنه)
  text: string; // نص الذكر (Blue in book)
  count: number; // تكرار الذكر (Red in book)
  countLabel: string; // (e.g. ثلاث مرات، مائة مرة)
  reward?: string; // فضل الذكر (Green in book)
  source: string; // تخريج الحديث (e.g. [صحيح الترغيب 656])
  albaniNotes?: string; // تعليقات الشيخ رحمه الله
  additionalContext?: string; // مناسبة القول
}

export type CategoryId =
  | 'all'
  | 'sabah_masaa'
  | 'sleep_wake'
  | 'prayer_wudu'
  | 'athan_masjid'
  | 'distress_relief'
  | 'daily_life'
  | 'ruqyah_illness'
  | 'travel_hajj'
  | 'general_duas';

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  description: string;
  iconName: string;
}

export interface ReminderConfig {
  id: string;
  title: string;
  description: string;
  defaultTime: string; // "HH:MM"
  time: string;
  enabled: boolean;
  categoryLink: CategoryId;
}

export interface AppSettings {
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  fontSize: number; // base size modifier in px (e.g. 18 to 28)
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showTashkeel: boolean;
  showAlbaniNotes: boolean;
}
