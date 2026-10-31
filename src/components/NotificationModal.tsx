import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Volume2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ReminderConfig, ThemeColor } from '../types';
import { playReminderChime } from '../utils/audio';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: ReminderConfig[];
  onUpdateReminders: (updated: ReminderConfig[]) => void;
  themeColor: ThemeColor;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onUpdateReminders,
  themeColor,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermission(res);
      } catch {
        // Fallback
      }
    }
  };

  const handleToggle = (id: string) => {
    const next = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    onUpdateReminders(next);
  };

  const handleTimeChange = (id: string, newTime: string) => {
    const next = reminders.map(r => r.id === id ? { ...r, time: newTime } : r);
    onUpdateReminders(next);
  };

  const handleTestReminder = () => {
    playReminderChime();

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('تذكير الأذكار - جامع صحيح الأذكار', {
          body: 'حان الآن موعد أذكاركم اليومية، حفظكم الله ورعاكم.',
          icon: '/favicon.ico',
        });
      } catch {
        // Ignore
      }
    }

    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden"
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
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-50">
                نظام التنبيهات والتذكير اليومي
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                جدولة التذكير بأوقات الأذكار الفاضلة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Permission Notice Banner */}
          {permission !== 'granted' && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>يرجى تفعيل إذن إشعارات المتصفح لضمان وصول التنبيهات في وقتها.</span>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
              >
                تفعيل الإشعارات
              </button>
            </div>
          )}

          {/* Test reminder button */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                صوت التنبيه والتجربة
              </span>
            </div>
            <button
              onClick={handleTestReminder}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                testSent 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600'
              }`}
            >
              {testSent ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{testSent ? 'تم إرسال التجربة' : 'تجربة التنبيه والصوت'}</span>
            </button>
          </div>

          {/* Reminders List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              قائمة التنبيهات اليومية:
            </span>

            {reminders.map(reminder => (
              <div 
                key={reminder.id}
                className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {reminder.title}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {reminder.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Time input */}
                  <div className="flex items-center gap-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="time"
                      value={reminder.time}
                      onChange={e => handleTimeChange(reminder.id, e.target.value)}
                      className="bg-transparent text-stone-800 dark:text-stone-200 outline-hidden font-bold cursor-pointer"
                    />
                  </div>

                  {/* Toggle switch */}
                  <button
                    onClick={() => handleToggle(reminder.id)}
                    aria-label={`تفعيل ${reminder.title}`}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                      reminder.enabled
                        ? themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-indigo-600'
                        : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <div 
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        reminder.enabled ? '-translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
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
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
