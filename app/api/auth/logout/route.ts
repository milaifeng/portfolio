import { NextResponse } from "next/server";
import { getSession } from "@/lib/session"; // 你的 session 工具

export async function POST() {
  const session = await getSession();
  session.destroy();
  await session.save();

  // 设置 cookie 过期（双保险）
  const response = NextResponse.json({
    success: true,
    message: "退出登录成功",
  });

  // response.headers.set(
  //   "Set-Cookie",
  //   `${session.}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`
  // );

  return response;
}
