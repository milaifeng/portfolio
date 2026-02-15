import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { comments } from "@/db/schema/comments";

export async function POST(request: Request) {
  const session = await getSession();
  const { content, postSlug, parentId } = await request.json();
  if (!content.trim()) {
    return NextResponse.json(
      { success: false, message: "评论内容不能为空" },
      { status: 400 },
    );
  }

  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "用户未登录" },
      { status: 401 },
    );
  }

  try {
    const values: typeof comments.$inferInsert = {
      content: content.trim(),
      userId: userId,
      postSlug: postSlug,
      ...(parentId && { parentId }),
    };

    const [newComment] = await db
      .insert(comments)
      .values(values)
      .returning();

    return NextResponse.json({
      success: true,
      message: "评论创建成功",
      comment: newComment,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "评论创建失败" },
      { status: 500 },
    );
  }
}
