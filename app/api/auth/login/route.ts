import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function POST(request: NextRequest) {
  const session = await getSession();
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: "用户名和密码不能为空" },
      { status: 400 },
    );
  }
  // 查找用户
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (user.length === 0) {
    return NextResponse.json(
      { success: false, message: "用户名和密码错误" },
      { status: 401 },
    );
  }
  const foundUser = user[0];
  // 验证密码
  const passwordMatch = await bcrypt.compare(password, foundUser.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { success: false, message: "用户名和密码错误" },
      { status: 401 },
    );
  }
  session.user = {
    id: foundUser.id,
    username: foundUser.username,
    email: foundUser.email,
    avatar: foundUser.avatar || "/images/default-avatar.png",
  };

  await session.save();
  return NextResponse.json(
    {
      success: true,
      message: "登录成功",
    },
    { status: 200 },
  );
}
