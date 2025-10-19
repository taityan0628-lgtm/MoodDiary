"use client";

import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data: users, isLoading, error } = trpc.user.list.useQuery();

  if (isLoading) {
    return <div className="p-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">エラー: {error.message}</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">ユーザー一覧</h1>
      <div className="space-y-2">
        {users?.map((user) => (
          <div key={user.id} className="p-4 border rounded">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
