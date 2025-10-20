'use client';

import { Button } from './ui/button';
import { Card } from './ui/card';
import * as LucideIcons from 'lucide-react';
import { trpc } from '@/utils/trpc';

interface MoodSelectorProps {
  selectedColor: string;
  selectedIcon: string;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
}

// Lucide Reactのアイコンコンポーネントを取得するヘルパー関数
const getIconComponent = (iconName: string) => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  return icons[iconName] || LucideIcons.Circle;
};

export function MoodSelector({ selectedColor, selectedIcon, onColorChange, onIconChange }: MoodSelectorProps) {
  const { data: moods, isLoading, error } = trpc.mood.list.useQuery();

  if (isLoading) {
    return (
      <Card className="p-6 space-y-6">
        <div className="text-center text-gray-500">読み込み中...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 space-y-6">
        <div className="text-center text-red-500">エラーが発生しました: {error.message}</div>
      </Card>
    );
  }

  if (!moods || moods.length === 0) {
    return (
      <Card className="p-6 space-y-6">
        <div className="text-center text-gray-500">気分データがありません</div>
      </Card>
    );
  }

  // orderでソート
  const sortedMoods = [...moods].sort((a, b) => a.order - b.order);

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="mb-4">今日の気分の色を選んでください</h3>
        <div className="grid grid-cols-4 gap-3">
          {sortedMoods.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedColor === mood.color ? 'default' : 'outline'}
              onClick={() => onColorChange(mood.color)}
              className="h-16 w-full relative overflow-hidden"
              style={{
                backgroundColor: selectedColor === mood.color ? mood.color : 'transparent',
                borderColor: mood.color,
                borderWidth: '2px'
              }}
            >
              <div
                className="absolute inset-1 rounded opacity-30"
                style={{ backgroundColor: mood.color }}
              />
              <span className="relative z-10 text-xs">{mood.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4">気分を表すアイコンを選んでください</h3>
        <div className="grid grid-cols-4 gap-3">
          {sortedMoods.map((mood) => {
            const IconComponent = getIconComponent(mood.icon);
            return (
              <Button
                key={mood.id}
                variant={selectedIcon === mood.icon ? 'default' : 'outline'}
                onClick={() => onIconChange(mood.icon)}
                className="h-16 aspect-square"
              >
                <div className="flex flex-col items-center gap-1">
                  <IconComponent size={20} />
                  <span className="text-xs">{mood.name}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}