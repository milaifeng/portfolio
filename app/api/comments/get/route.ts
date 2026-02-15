import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema/comments";
import { users } from "@/db/schema/users";
import { eq, asc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("postSlug") || "guestbook";

  try {
    const commentList = await db
      .select({
        id: comments.id,
        content: comments.content,
        userId: comments.userId,
        username: users.username,
        avatar: users.avatar,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postSlug, postSlug))
      .orderBy(asc(comments.createdAt));
    return NextResponse.json({ success: true, comments: commentList });
  } catch {
    return NextResponse.json(
      { success: false, message: "获取评论失败" },
      { status: 500 },
    );
  }
}
