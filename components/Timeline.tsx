import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Search, Calendar as CalendarIcon, Filter } from "lucide-react";
import * as Icons from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MoodEntry {
  id: string;
  title: string;
  content: string;
  color: string;
  icon: string;
  date: string;
  timestamp: string;
}

interface TimelineProps {
  entries: MoodEntry[];
  onEntryClick: (entry: MoodEntry) => void;
}

export function Timeline({ entries, onEntryClick }: TimelineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [colorFilter, setColorFilter] = useState<string>("all");

  const uniqueColors = useMemo(() => {
    const colors = new Set(entries.map((entry) => entry.color));
    return Array.from(colors);
  }, [entries]);

  const filteredAndSortedEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesColor = colorFilter === "all" || entry.color === colorFilter;

      return matchesSearch && matchesColor;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [entries, searchQuery, sortOrder, colorFilter]);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    const timeStr = date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (diffDays === 0) return `今日 ${timeStr}`;
    if (diffDays === 1) return `昨日 ${timeStr}`;
    if (diffDays < 7) return `${diffDays}日前 ${timeStr}`;

    return (
      date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) + ` ${timeStr}`
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2>タイムライン</h2>
          <p className="text-muted-foreground">すべての日記をまとめて見る</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="タイトルや内容で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={sortOrder}
              onValueChange={(value: "newest" | "oldest") =>
                setSortOrder(value)
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">新しい順</SelectItem>
                <SelectItem value="oldest">古い順</SelectItem>
              </SelectContent>
            </Select>

            <Select value={colorFilter} onValueChange={setColorFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="色で絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての色</SelectItem>
                {uniqueColors.map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      色フィルター
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredAndSortedEntries.length}件の日記
            </p>
            {(searchQuery || colorFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setColorFilter("all");
                }}
              >
                フィルターをクリア
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredAndSortedEntries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>条件に合う日記が見つかりませんでした</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedEntries.map((entry) => {
            const IconComponent = getIconComponent(entry.icon);
            return (
              <Card
                key={entry.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onEntryClick(entry)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: entry.color }}
                    >
                      <IconComponent className="text-white" size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="truncate">{entry.title}</h3>
                        <Badge variant="secondary" className="flex-shrink-0">
                          {formatDateTime(entry.timestamp)}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
