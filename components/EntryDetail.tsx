import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
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

interface EntryDetailProps {
  entry: MoodEntry | null;
  onClose: () => void;
}

export function EntryDetail({ entry, onClose }: EntryDetailProps) {
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  if (!entry) return null;

  const IconComponent = getIconComponent(entry.icon);
  const formattedDate = new Date(entry.timestamp).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  const formattedTime = new Date(entry.timestamp).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: entry.color }}
            >
              <IconComponent className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <DialogTitle>{entry.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {formattedDate} {formattedTime}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="whitespace-pre-wrap">
            {entry.content}
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">この日の気分の色</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
