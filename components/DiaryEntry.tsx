'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { trpc } from '@/utils/trpc';

interface DiaryEntryProps {
  selectedColor: string;
  selectedIcon: string;
  onSave?: () => void; // 保存成功時のコールバック（オプション）
}

export function DiaryEntry({ selectedColor, selectedIcon, onSave }: DiaryEntryProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ユーザー取得
  const { data: user } = trpc.user.getByEmail.useQuery({
    email: 'sato@example.com',
  });

  // Mood一覧取得
  const { data: moods } = (trpc as any).mood?.list?.useQuery?.();

  // 日記追加のmutation
  const utils = trpc.useUtils();
  const addDiary = trpc.diary.add.useMutation({
    onSuccess: () => {
      // 保存成功時にTimelineのデータを再取得
      utils.diary.getAll.invalidate();
      setTitle('');
      setContent('');
      onSave?.();
    },
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !user?.id || !moods) return;

    // colorとiconから対応するmoodを見つける
    const mood = moods.find(
      (m: any) => m.color === selectedColor && m.icon === selectedIcon
    );

    if (!mood) {
      console.error('選択された気分が見つかりません');
      return;
    }

    const now = new Date();

    addDiary.mutate({
      title: title.trim(),
      content: content.trim(),
      moodId: mood.id,
      userId: user.id,
      date: now,
    });
  };

  const isValid = title.trim() && content.trim() && selectedColor && selectedIcon && user?.id;

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
        disabled={!isValid || addDiary.isPending}
        className="w-full"
      >
        {addDiary.isPending ? '保存中...' : '日記を保存'}
      </Button>

      {addDiary.isError && (
        <div className="text-sm text-red-500">
          エラーが発生しました: {addDiary.error.message}
        </div>
      )}

      {addDiary.isSuccess && (
        <div className="text-sm text-green-500">
          日記を保存しました！
        </div>
      )}
    </Card>
  );
}