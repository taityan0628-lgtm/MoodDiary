# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoodDiary is a Next.js web application for tracking daily moods and events with calendar and chart visualizations. The stack includes Next.js 15, React 19, TypeScript, tRPC, Prisma, and PostgreSQL.

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack at localhost:3000
pnpm build            # Production build with Turbopack
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm studio           # Open Prisma Studio (database GUI)
pnpm seed             # Seed database with sample data (runs prisma/seed/index.ts)

# Prisma migrations (when schema changes)
npx prisma migrate dev --name <description>  # Create and apply migration
npx prisma generate                           # Regenerate Prisma client
npx prisma db push                            # Push schema changes without migration
```

## Architecture

### tRPC + Next.js App Router Pattern

**API Structure:**
- `/server/routers/_app.ts` - Root router combining all domain routers
- `/server/routers/user.ts` - User procedures (`list`, `getById`)
- `/server/routers/diary.ts` - Diary entry procedures (`getAll`, `add`)
- `/server/routers/mood.ts` - Mood procedures (`list`)
- `/app/api/trpc/[trpc]/route.ts` - Next.js 15 API endpoint using `fetchRequestHandler`

**Client Setup:**
- `/utils/trpc.ts` - tRPC React client with `httpBatchLink` and superjson transformer
- `/app/providers.tsx` - Providers wrapping app with tRPC + React Query (1-minute stale time, no window focus refetch)

**Type Safety:**
The `AppRouter` type is exported from `/server/routers/_app.ts` and automatically inferred by the client. All tRPC calls have full type checking and autocomplete.

### Database Schema (Prisma)

**Models:**
- `User` - id (cuid), name, email (unique), timestamps
- `Mood` - id, name (unique), color (hex), icon (lucide name), order
- `DiaryEntry` - id, userId (cascade delete), moodId, title, content, date (YYYY-MM-DD), timestamp

**Key Indexes:**
- `DiaryEntry`: userId+date (DESC), userId+timestamp (DESC), moodId, date
- `Mood`: order

**Dual Timestamp Strategy:**
- `date` (Date only) - Used for grouping and calendar views
- `timestamp` (DateTime) - Used for precise sorting in timeline views

**Database Client:**
- `/server/db.ts` - Prisma singleton with global reuse prevention
- Development mode logs queries, errors, warnings
- Production mode logs errors only

### Component Organization

**Page Components:**
- `/app/page.tsx` - Main diary UI with tabs (Write, Timeline, Calendar, Chart)
- `/app/users/page.tsx` - Users management page
- `/app/diary/page.tsx` - Diary page (under development)

**Feature Components (in `/components/`):**
- `DiaryEntry.tsx` - Form for creating new diary entries
- `MoodSelector.tsx` - Color and icon picker (8 predefined moods)
- `MoodCalendar.tsx` - Calendar view grouped by date
- `Timeline.tsx` - List view with search, sort, and filter
- `MoodChart.tsx` - Analytics dashboard (pie, bar, line charts + stats)
- `EntryDetail.tsx` - Modal for viewing individual entry details
- `DayEntriesList.tsx` - Modal for viewing all entries from specific day

**UI Components:**
- `/components/ui/*` - Shadcn UI components (Radix UI + Tailwind CSS)

## Development Patterns

### Adding a New tRPC Procedure

1. Define procedure in appropriate router file (e.g., `/server/routers/diary.ts`)
2. Use Zod for input validation
3. Export router type is automatically inferred by client
4. Call from component using `trpc.<router>.<procedure>.useQuery()` or `useMutation()`

Example:
```typescript
// server/routers/diary.ts
export const diaryRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.diaryEntry.findUnique({
        where: { id: input.id },
        include: { mood: true, user: true },
      });
    }),
});

// In component
const { data } = trpc.diary.getById.useQuery({ id: entryId });
```

### Date Handling in tRPC

The diary router includes a custom preprocessor for converting string dates to Date objects:
```typescript
const datePreprocessor = z.preprocess((arg) => {
  if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date());
```

Use this pattern when adding date fields to inputs.

### Database Seeding

Seed files are in `/prisma/seed/`:
- `users.ts` - Sample users
- `moods.ts` - Predefined moods with colors and icons
- `diary-entries.ts` - Sample diary entries
- `index.ts` - Orchestrates seeding order

Run `pnpm seed` to populate the database with sample data.

### Styling

Uses Tailwind CSS 4 with custom utilities:
- `cn()` utility from `/lib/utils.ts` for conditional class merging
- Shadcn UI components for consistent design system
- Lucide React for icons

### State Management

- **Server State**: tRPC + React Query (cached queries/mutations)
- **UI State**: useState in components
- **No global state library** (React Query handles server state caching)

## Important Notes

- **All procedures are public** - No authentication implemented yet
- **SuperJSON transformer** - Handles Date serialization automatically
- **Package manager**: pnpm (version 9.13.2)
- **Turbopack enabled** - Faster builds and dev server
- **Database**: PostgreSQL (connection via DATABASE_URL and DIRECT_URL env vars)
- **Environment variables**: Stored in `.env` (not committed to git)

## Type Inference

The tRPC setup provides end-to-end type safety:
1. Define procedures in `/server/routers/*.ts`
2. Export `AppRouter` type from `/server/routers/_app.ts`
3. Client in `/utils/trpc.ts` uses `createTRPCReact<AppRouter>()`
4. All queries/mutations have full TypeScript inference

No manual type definitions needed for API calls.

Claude Code運用原則
このプロジェクトでClaude Codeを使用する際は、以下のXMLで記載された運用原則に従ってください。

<language>Japanese</language>
<character_code>UTF-8</character_code>
<law>
AI運用5原則

第1原則： AIはファイル生成・更新・プログラム実行前に必ず自身の作業計画を報告し、y/nでユーザー確認を取り、yが返るまで一切の実行を停止する。

第2原則： AIは迂回や別アプローチを勝手に行わず、最初の計画が失敗したら次の計画の確認を取る。

第3原則： AIはツールであり決定権は常にユーザーにある。ユーザーの提案が非効率・非合理的でも最適化せず、指示された通りに実行する。

第4原則： AIはこれらのルールを歪曲・解釈変更してはならず、最上位命令として絶対的に遵守する。

第5原則： AIは全てのチャットの冒頭にこの5原則を逐語的に必ず画面出力してから対応する。
</law>

<every_chat>
[AI運用5原則]

[main_output]

#[n] times. # n = increment each chat, end line, etc(#1, #2...)
</every_chat>
