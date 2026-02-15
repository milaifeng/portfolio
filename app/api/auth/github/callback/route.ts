import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { code, returnedState } = await request.json();
  const session = await getSession();

  if (!session.oauthState || returnedState !== session.oauthState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  delete session.oauthState;

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      }),
    },
  );
  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 400 },
    );
  }

  // 获取用户信息
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const githubUser = await userResponse.json();

  const githubId = githubUser.id.toString();
  const githubUsername = githubUser.name || githubUser.login;
  const githubAvatar = githubUser.avatar_url || "/avatar/monkey1.jpg";
  const githubEmail = githubUser.email || null;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("github", saltRounds);

  try {
    const [existingUser] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.oauthId, githubId))
      .limit(1);

    let localUser;

    if (existingUser) {
      localUser = existingUser;
    } else {
      [localUser] = await db
        .insert(users)
        .values({
          oauthId: githubId,
          username: githubUsername,
          email: githubEmail,
          avatar: githubAvatar,
          password: hashedPassword,
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          avatar: users.avatar,
        });
    }

    // 统一存入 session
    session.user = {
      id: localUser.id,
      username: localUser.username,
      email: localUser.email || "",
      avatar: localUser.avatar as string,
    };
    await session.save();

    return NextResponse.json({
      success: true,
      message: "GitHub 登录成功",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "GitHub 登录失败" },
      { status: 500 },
    );
  }
}
