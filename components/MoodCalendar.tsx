import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

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
  entries: MoodEntry[];
  onEntryClick: (entry: MoodEntry) => void;
  onDayClick: (dayEntries: MoodEntry[]) => void;
}

export function MoodCalendar({ entries, onEntryClick, onDayClick }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const calendarDays = [];
  const currentDateIter = new Date(startDate);
  
  while (currentDateIter <= endDate) {
    calendarDays.push(new Date(currentDateIter));
    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }

  const entriesByDate = useMemo(() => {
    const map = new Map<string, MoodEntry[]>();
    entries.forEach(entry => {
      const dateKey = entry.date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(entry);
    });
    return map;
  }, [entries]);

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
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEntries = entriesByDate.get(dateStr) || [];
    
    if (dayEntries.length === 1) {
      onEntryClick(dayEntries[0]);
    } else if (dayEntries.length > 1) {
      onDayClick(dayEntries);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

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
            <div key={day} className="text-center p-2">
              {day}
            </div>
          ))}
          
          {calendarDays.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayEntries = entriesByDate.get(dateStr) || [];
            const hasEntries = dayEntries.length > 0;

            return (
              <div
                key={index}
                className={`
                  min-h-20 p-2 rounded-lg border-2 transition-all
                  ${isCurrentMonth(date) ? 'bg-card' : 'bg-muted/30'}
                  ${isToday(date) ? 'border-primary' : 'border-transparent'}
                  ${hasEntries ? 'cursor-pointer hover:shadow-md' : ''}
                `}
                onClick={() => hasEntries && handleDayClick(date)}
              >
                <div className={`text-sm mb-1 ${!isCurrentMonth(date) ? 'text-muted-foreground' : ''}`}>
                  {date.getDate()}
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