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

// Mock initial data
const mockEntries: MoodEntry[] = [
  {
    id: "mock-1",
    title: "楽しい一日",
    content: "友達と遊んで、とても楽しい時間を過ごしました。今日は本当に幸せな気分です。",
    color: "#FFD700",
    icon: "Sun",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timestamp: new Date(Date.now() - 86400000 + 36000000).toISOString(),
  },
  {
    id: "mock-2", 
    title: "静かな午後",
    content: "雨の音を聞きながら読書をしました。とても穏やかで心地よい時間でした。",
    color: "#87CEEB",
    icon: "Cloud",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    timestamp: new Date(Date.now() - 86400000 + 50400000).toISOString(), // Yesterday 14:00
  },
  {
    id: "mock-3",
    title: "新しい挑戦",
    content: "新しいプロジェクトを始めました。情熱を持って取り組んでいきたいと思います。",
    color: "#FF6B6B",
    icon: "Zap",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
    timestamp: new Date(Date.now() - 86400000 * 2 + 32400000).toISOString(), // 2 days ago 09:00
  },
];

export default function Page() {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>(mockEntries);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [selectedDayEntries, setSelectedDayEntries] = useState<MoodEntry[]>([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('moodEntries');
    if (saved) {
      try {
        const parsedEntries = JSON.parse(saved);
        setEntries([...mockEntries, ...parsedEntries]);
      } catch (error) {
        console.error('Failed to load entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    const userEntries = entries.filter(entry => 
      !mockEntries.some(mock => mock.id === entry.id)
    );
    localStorage.setItem('moodEntries', JSON.stringify(userEntries));
  }, [entries]);

  const handleSaveEntry = (newEntry: MoodEntry) => {
    setEntries(prev => [newEntry, ...prev]);
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
              entries={entries}
              onEntryClick={handleEntryClick}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <MoodCalendar
              entries={entries}
              onEntryClick={handleEntryClick}
              onDayClick={handleDayClick}
            />
          </TabsContent>

          <TabsContent value="chart">
            <MoodChart entries={entries} />
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
