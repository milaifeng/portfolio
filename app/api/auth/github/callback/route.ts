import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

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
  const userData = await userResponse.json();
  session.user = {
    name: userData.name || userData.login,
    avatar: userData.avatar_url,
  };
  await session.save();
  return NextResponse.json({
    success: true,
  });
}
