'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { trpc } from '@/utils/trpc';
import dayjs from 'dayjs';

interface MoodEntry {
  id: string;
  title: string;
  content: string;
  color: string;
  icon: string;
  date: string;
  timestamp: string;
}

interface MoodCalendarProps {
  onEntryClick: (entry: MoodEntry) => void;
  onDayClick: (dayEntries: MoodEntry[]) => void;
}

export function MoodCalendar({ onEntryClick, onDayClick }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // ユーザー取得
  const { data: user } = trpc.user.getByEmail.useQuery({
    email: 'sato@example.com',
  });

  // 日記データ取得
  const { data: diaryEntries, isLoading, error } = trpc.diary.getAll.useQuery(
    {
      userId: user?.id || '',
    },
    {
      enabled: !!user?.id,
    }
  );

  // データベースから取得したデータをMoodEntry形式に変換
  const entries: MoodEntry[] = useMemo(() => {
    if (!diaryEntries) return [];

    return diaryEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      color: entry.mood.color,
      icon: entry.mood.icon,
      date: dayjs(entry.date).format('YYYY-MM-DD'),
      timestamp: dayjs(entry.timestamp).toISOString(),
    }));
  }, [diaryEntries]);

  // 日付ごとにエントリーをグループ化
  const entriesByDate = useMemo(() => {
    const map = new Map<string, MoodEntry[]>();

    entries.forEach((entry) => {
      const existing = map.get(entry.date);
      if (existing) {
        existing.push(entry);
      } else {
        map.set(entry.date, [entry]);
      }
    });

    return map;
  }, [entries]);

  // カレンダーに表示する日付の配列を生成
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 月の最初と最後の日
    const firstDay = dayjs(new Date(year, month, 1));
    const lastDay = dayjs(new Date(year, month + 1, 0));

    // カレンダーの開始日（月の最初の日の週の日曜日）
    const startDay = firstDay.subtract(firstDay.day(), 'day');

    // カレンダーの終了日（月の最後の日の週の土曜日）
    const endDay = lastDay.add(6 - lastDay.day(), 'day');

    // 日付の配列を生成
    const days: Date[] = [];
    let current = startDay;

    while (current.isBefore(endDay) || current.isSame(endDay, 'day')) {
      days.push(current.toDate());
      current = current.add(1, 'day');
    }

    return days;
  }, [currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getIconComponent = (iconName: string) => {
    const icons = Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
    return icons[iconName] || Icons.Circle;
  };

  const handleDayClick = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const dayEntries = entriesByDate.get(dateStr) || [];

    if (dayEntries.length === 1) {
      onEntryClick(dayEntries[0]);
    } else if (dayEntries.length > 1) {
      onDayClick(dayEntries);
    }
  };

  const isToday = (date: Date) => {
    return dayjs(date).isSame(dayjs(), 'day');
  };

  const isCurrentMonth = (date: Date) => {
    return dayjs(date).month() === month;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          読み込み中...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-red-500">
          エラーが発生しました: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2>
            {year}年 {month + 1}月
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              今日
            </Button>
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="text-center p-2 font-semibold text-sm">
              {day}
            </div>
          ))}

          {calendarDays.map((date, index) => {
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            const dayEntries = entriesByDate.get(dateStr) || [];
            const hasEntries = dayEntries.length > 0;

            return (
              <div
                key={`${dateStr}-${index}`}
                className={`
                  min-h-20 p-2 rounded-lg border-2 transition-all
                  ${isCurrentMonth(date) ? 'bg-card' : 'bg-muted/30'}
                  ${isToday(date) ? 'border-primary' : 'border-transparent'}
                  ${hasEntries ? 'cursor-pointer hover:shadow-md' : ''}
                `}
                onClick={() => hasEntries && handleDayClick(date)}
              >
                <div className={`text-sm mb-1 ${!isCurrentMonth(date) ? 'text-muted-foreground' : ''}`}>
                  {dayjs(date).date()}
                </div>

                <div className="flex flex-wrap gap-1">
                  {dayEntries.slice(0, 3).map((entry) => {
                    const IconComponent = getIconComponent(entry.icon);
                    return (
                      <div
                        key={entry.id}
                        className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: entry.color }}
                        title={entry.title}
                      >
                        <IconComponent className="text-white" size={12} />
                      </div>
                    );
                  })}
                  {dayEntries.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      +{dayEntries.length - 3}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
