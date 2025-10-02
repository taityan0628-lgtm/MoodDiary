import { Button } from './ui/button';
import { Card } from './ui/card';
import { Heart, Sun, Cloud, Moon, Zap, Coffee, Star, Smile } from 'lucide-react';

interface MoodSelectorProps {
  selectedColor: string;
  selectedIcon: string;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
}

const MOOD_COLORS = [
  { name: '幸せ', color: '#FFD700', label: '黄色（幸せ）' },
  { name: '穏やか', color: '#87CEEB', label: '水色（穏やか）' },
  { name: '情熱', color: '#FF6B6B', label: '赤色（情熱）' },
  { name: '自然', color: '#98D8C8', label: '緑色（自然）' },
  { name: '神秘', color: '#9B59B6', label: '紫色（神秘）' },
  { name: '活力', color: '#FF8C00', label: 'オレンジ（活力）' },
  { name: '憂鬱', color: '#708090', label: 'グレー（憂鬱）' },
  { name: '愛情', color: '#FFB6C1', label: 'ピンク（愛情）' },
];

const MOOD_ICONS = [
  { name: 'ハート', icon: 'Heart', component: Heart },
  { name: '太陽', icon: 'Sun', component: Sun },
  { name: '雲', icon: 'Cloud', component: Cloud },
  { name: '月', icon: 'Moon', component: Moon },
  { name: '雷', icon: 'Zap', component: Zap },
  { name: 'コーヒー', icon: 'Coffee', component: Coffee },
  { name: '星', icon: 'Star', component: Star },
  { name: '笑顔', icon: 'Smile', component: Smile },
];

export function MoodSelector({ selectedColor, selectedIcon, onColorChange, onIconChange }: MoodSelectorProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="mb-4">今日の気分の色を選んでください</h3>
        <div className="grid grid-cols-4 gap-3">
          {MOOD_COLORS.map((mood) => (
            <Button
              key={mood.color}
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
          {MOOD_ICONS.map((mood) => {
            const IconComponent = mood.component;
            return (
              <Button
                key={mood.icon}
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