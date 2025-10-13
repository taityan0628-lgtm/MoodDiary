// ============================================
// ユーザーデータ
// ============================================
import { PrismaClient, User } from "@prisma/client";

export async function seedUsers(prisma: PrismaClient): Promise<User[]> {
  const usersData = [
    {
      name: "田中太郎",
      email: "tanaka@example.com",
    },
    {
      name: "佐藤花子",
      email: "sato@example.com",
    },
  ];

  const users = await Promise.all(
    usersData.map((data) => prisma.user.create({ data }))
  );

  return users;
}
