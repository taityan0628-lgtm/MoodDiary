"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import * as Icons from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface MoodEntry {
  id: string;
  title: string;
  content: string;
  color: string;
  icon: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO文字列
}

interface MoodChartProps {
  entries: MoodEntry[];
}

export function MoodChart({ entries }: MoodChartProps) {
  // 色の分布
  const colorStats = useMemo(() => {
    const colorCount = new Map<string, number>();
    entries.forEach((entry) => {
      colorCount.set(entry.color, (colorCount.get(entry.color) || 0) + 1);
    });

    return Array.from(colorCount.entries())
      .map(([color, count]) => ({
        color,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  // 時間帯分布
  const timeOfDayStats = useMemo(() => {
    const timeSlots = {
      morning: { name: "朝 (5-11時)", count: 0 },
      afternoon: { name: "昼 (12-17時)", count: 0 },
      evening: { name: "夜 (18-23時)", count: 0 },
      night: { name: "深夜 (0-4時)", count: 0 },
    };

    entries.forEach((entry) => {
      const hour = new Date(entry.timestamp).getHours();
      if (hour >= 5 && hour <= 11) timeSlots.morning.count++;
      else if (hour >= 12 && hour <= 17) timeSlots.afternoon.count++;
      else if (hour >= 18 && hour <= 23) timeSlots.evening.count++;
      else timeSlots.night.count++;
    });

    return Object.values(timeSlots);
  }, [entries]);

  // 週トレンド
  const weeklyTrend = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    return last7Days.map((dateStr) => {
      const count = entries.filter((entry) => entry.date === dateStr).length;
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString("ja-JP", { weekday: "short" });
      const dayNum = date.getDate();

      return {
        date: dateStr,
        name: `${dayNum}日(${dayName})`,
        count,
      };
    });
  }, [entries]);

  // 連続記録
  const streakStats = useMemo(() => {
    const sortedDates = Array.from(new Set(entries.map((e) => e.date))).sort();

    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    sortedDates.forEach((dateStr) => {
      const date = new Date(dateStr);

      if (lastDate) {
        const diffDays = Math.floor(
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = date;
    });

    maxStreak = Math.max(maxStreak, currentStreak);

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const hasToday = sortedDates.includes(today);
    const hasYesterday = sortedDates.includes(yesterday);

    if (!hasToday && sortedDates[sortedDates.length - 1] !== yesterday) {
      currentStreak = 0;
    }

    return { currentStreak, maxStreak, totalDays: sortedDates.length };
  }, [entries]);

  // よく使うアイコン
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  const mostUsedIcon = useMemo(() => {
    const iconCount = new Map<string, number>();
    entries.forEach((entry) => {
      iconCount.set(entry.icon, (iconCount.get(entry.icon) || 0) + 1);
    });

    let maxIcon = "";
    let maxCount = 0;
    iconCount.forEach((count, icon) => {
      if (count > maxCount) {
        maxCount = count;
        maxIcon = icon;
      }
    });

    return { icon: maxIcon, count: maxCount };
  }, [entries]);

  const MostUsedIcon = mostUsedIcon.icon
    ? getIconComponent(mostUsedIcon.icon)
    : Icons.Circle;

  const chartConfig = {
    count: {
      label: "記録数",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      {/* 連続記録 / 総記録数 / アイコン */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* 連続記録 */}
        <Card>
          <CardHeader>
            <CardTitle>連続記録</CardTitle>
          </CardHeader>
          <CardContent>
            <p>現在: {streakStats.currentStreak}日</p>
            <p>最長: {streakStats.maxStreak}日</p>
            <p>記録した日数: {streakStats.totalDays}日</p>
          </CardContent>
        </Card>

        {/* 総記録数 */}
        <Card>
          <CardHeader>
            <CardTitle>総記録数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl">{entries.length}</p>
            <p className="text-muted-foreground">件の日記を書きました</p>
          </CardContent>
        </Card>

        {/* よく使うアイコン */}
        <Card>
          <CardHeader>
            <CardTitle>よく使うアイコン</CardTitle>
          </CardHeader>
          <CardContent>
            <MostUsedIcon size={32} />
            <p>{mostUsedIcon.count}回 使用</p>
          </CardContent>
        </Card>
      </div>

      {/* 折れ線グラフ: 1週間のトレンド */}
      <Card>
        <CardHeader>
            <CardTitle>1週間のトレンド</CardTitle>
            <CardDescription>過去7日間の記録数</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                />
                </LineChart>
            </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
      </Card>

      {/* 円グラフ + 棒グラフ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 色分布 */}
        <Card>
          <CardHeader>
            <CardTitle>気分の色の分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={colorStats}
                    dataKey="count"
                    nameKey="color"
                    outerRadius={100}
                    label
                  >
                    {colorStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || "#8884d8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 時間帯分布 */}
        <Card>
          <CardHeader>
            <CardTitle>時間帯別の記録</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
