import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
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

interface DayEntriesListProps {
  entries: MoodEntry[];
  onClose: () => void;
  onEntryClick: (entry: MoodEntry) => void;
}

export function DayEntriesList({ entries, onClose, onEntryClick }: DayEntriesListProps) {
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  if (entries.length === 0) return null;

  const date = new Date(entries[0].date);
  const formattedDate = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // Sort entries by timestamp
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Dialog open={entries.length > 0} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
          <DialogDescription>{entries.length}件の記録</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            {sortedEntries.map((entry) => {
              const IconComponent = getIconComponent(entry.icon);
              const time = new Date(entry.timestamp).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <Button
                  key={entry.id}
                  variant="ghost"
                  className="w-full p-4 h-auto justify-start hover:bg-muted/50"
                  onClick={() => {
                    onEntryClick(entry);
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: entry.color }}
                    >
                      <IconComponent size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="truncate">{entry.title}</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
