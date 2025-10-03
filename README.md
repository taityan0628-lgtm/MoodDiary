# MoodDiary

MoodDiary は、日々の気分や出来事を記録し、カレンダーやグラフで可視化できる Web アプリです。

## 主な機能

- 気分の記録・編集・削除
- 日ごとのエントリー一覧表示
- カレンダーによる気分の可視化
- 気分の推移グラフ表示
- タイムライン表示
- 詳細エントリーの閲覧

## 技術スタック

- Next.js
- TypeScript
- React
- Tailwind CSS
- Vercel（デプロイ）

## セットアップ

1. リポジトリをクローン
   ```bash
   git clone https://github.com/taityan0628-lgtm/MoodDiary.git
   cd MoodDiary
   ```
2. 依存関係をインストール
   ```bash
   pnpm install
   # または npm install / yarn install / bun install
   ```
3. 開発サーバーを起動
   ```bash
   pnpm dev
   # または npm run dev / yarn dev / bun dev
   ```
4. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## ディレクトリ構成

- `app/` ... ルートレイアウトやグローバル CSS
- `components/` ... UI コンポーネント群
- `lib/` ... ユーティリティ関数
- `public/` ... 画像・アイコン等の静的ファイル

## デプロイ

- Vercel
