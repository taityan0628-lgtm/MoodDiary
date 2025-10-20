'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoodSelector } from '@/components/MoodSelector';
import { DiaryEntry } from '@/components/DiaryEntry';
import { MoodCalendar } from '@/components/MoodCalendar';
import { MoodChart } from '@/components/MoodChart';
import { EntryDetail } from '@/components/EntryDetail';
import { DayEntriesList } from '@/components/DayEntriesList';
import { Timeline } from '@/components/Timeline';
import { List, BookOpen, Calendar, BarChart3 } from 'lucide-react';

interface MoodEntry {
  id: string;
  title: string;
  content: string;
  color: string;
  icon: string;
  date: string;
  timestamp: string;
}

export default function Page() {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [selectedDayEntries, setSelectedDayEntries] = useState<MoodEntry[]>([]);

  const handleSaveEntry = (newEntry: MoodEntry) => {
    // TODO: API経由で保存する実装が必要
    setSelectedColor('');
    setSelectedIcon('');
  };

  const handleEntryClick = (entry: MoodEntry) => {
    setSelectedEntry(entry);
    setSelectedDayEntries([]);
  };

  const handleDayClick = (dayEntries: MoodEntry[]) => {
    setSelectedDayEntries(dayEntries);
    setSelectedEntry(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="mb-2">気分シェア × ミニ日記</h1>
          <p className="text-muted-foreground">
            今日の気分を色とアイコンで表現して、日記と一緒に記録しましょう
          </p>
        </header>

        <Tabs defaultValue="write" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <BookOpen size={16} />
              書く
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <List size={16} />
              一覧
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar size={16} />
              カレンダー
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <BarChart3 size={16} />
              分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <MoodSelector
                selectedColor={selectedColor}
                selectedIcon={selectedIcon}
                onColorChange={setSelectedColor}
                onIconChange={setSelectedIcon}
              />
              <DiaryEntry
                selectedColor={selectedColor}
                selectedIcon={selectedIcon}
                onSave={handleSaveEntry}
              />
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Timeline
              onEntryClick={handleEntryClick}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <MoodCalendar
              onEntryClick={handleEntryClick}
              onDayClick={handleDayClick}
            />
          </TabsContent>

          <TabsContent value="chart">
            <MoodChart entries={[]} />
          </TabsContent>
        </Tabs>

        <EntryDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />

        <DayEntriesList
          entries={selectedDayEntries}
          onClose={() => setSelectedDayEntries([])}
          onEntryClick={handleEntryClick}
        />
      </div>
    </div>
  );
}
