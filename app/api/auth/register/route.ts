import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq, or } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await getSession();
  const { username, password, email, captcha } = await req.json();

  // 1. 验证验证码
  if (
    !session.captchaText ||
    !session.captchaExpire ||
    Date.now() > session.captchaExpire ||
    captcha.toLowerCase() !== session.captchaText
  ) {
    return NextResponse.json(
      { success: false, message: "验证码错误或过期" },
      { status: 400 },
    );
  }

  // 清除验证码（防重用）
  delete session.captchaText;
  delete session.captchaExpire;

  // 2. 检查用户名/邮箱是否重复（Drizzle 查询）
  const existingUser = await db
    .select()
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1);

  if (existingUser.length > 0) {
    return NextResponse.json(
      { success: false, message: "用户名或邮箱已存在" },
      { status: 400 },
    );
  }

  // 3. 加密密码
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const defaultAvatar = "/avatar/monkey1.jpg";

  // 4. 创建用户（Drizzle 插入）
  try {
    const [newUser] = await db
      .insert(users)
      .values({
        username: username,
        email: email,
        password: hashedPassword,
        avatar: defaultAvatar,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
      });

    // 存 session
    session.user = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar as string,
    };
    await session.save();

    return NextResponse.json({ success: true, message: "注册成功" });
  } catch (error) {
    console.error("注册失败", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 },
    );
  }
}
