import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DiaryEntryProps {
  selectedColor: string;
  selectedIcon: string;
  onSave: (entry: {
    id: string;
    title: string;
    content: string;
    color: string;
    icon: string;
    date: string;
    timestamp: string;
  }) => void;
}

export function DiaryEntry({ selectedColor, selectedIcon, onSave }: DiaryEntryProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    const now = new Date();
    const entry = {
      id: `entry-${now.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
      icon: selectedIcon,
      date: now.toISOString().split('T')[0],
      timestamp: now.toISOString(),
    };
    
    onSave(entry);
    setTitle('');
    setContent('');
  };

  const isValid = title.trim() && content.trim() && selectedColor && selectedIcon;

  return (
    <Card className="p-6 space-y-4">
      <h3>今日の日記を書いてください</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          placeholder="今日の出来事のタイトル..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">内容</Label>
        <Textarea
          id="content"
          placeholder="今日はどんな日でしたか？気分や出来事を自由に書いてください..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-32 resize-none"
        />
      </div>

      {selectedColor && selectedIcon && (
        <div className="flex items-center gap-2 p-3 rounded-lg border">
          <div 
            className="w-6 h-6 rounded-full border-2"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm text-muted-foreground">
            選択された気分: {selectedColor} + {selectedIcon}
          </span>
        </div>
      )}

      <Button 
        onClick={handleSave} 
        disabled={!isValid}
        className="w-full"
      >
        日記を保存
      </Button>
    </Card>
  );
}