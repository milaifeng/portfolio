import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  oauthState?: string;
  user?: {
    name: string;
    avatar: string;
  };
}

export const getSession = async () => {
  const cookiesStore = await cookies();
  return getIronSession<SessionData>(cookiesStore, {
    password: process.env.IRON_SESSION_PASSWORD as string,
    cookieName: "blog_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  });
};
