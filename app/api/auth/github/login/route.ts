import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { randomUUID } from "crypto";

export async function GET() {
  const session = await getSession();
  const state = randomUUID();
  session.oauthState = state;
  await session.save();

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${state}`;
  return NextResponse.json({ authUrl });
}
