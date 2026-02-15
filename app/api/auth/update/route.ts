import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq, or, not, and } from "drizzle-orm";

type UpdateUserData = {
  username: string;
  email: string;
  avatar?: string;
  password?: string;
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.user?.id) {
    return NextResponse.json(
      { success: false, message: "未登录" },
      { status: 401 },
    );
  }

  const { username, email, avatar, password } = await req.json();

  // 校验必填
  if (!username || !email) {
    return NextResponse.json(
      { success: false, message: "用户名和邮箱不能为空" },
      { status: 400 },
    );
  }

  // 唯一性校验（排除当前用户）
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        or(eq(users.username, username), eq(users.email, email)),
        not(eq(users.id, session.user.id)), // 排除自己
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { success: false, message: "用户名或邮箱已存在" },
      { status: 400 },
    );
  }

  // 更新数据
  const updateData: UpdateUserData = { username, email, avatar };

  if (password && password.trim() !== null) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  try {
    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    // 更新 session
    session.user = {
      ...session.user,
      username: updated.username,
      email: updated.email,
      avatar: updated.avatar as string,
    };
    await session.save();

    return NextResponse.json({ success: true, user: session.user });
  } catch (error) {
    console.error("更新失败:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 },
    );
  }
}
