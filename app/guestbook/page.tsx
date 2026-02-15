"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import DiscussCard from "@/components/guestbook/DiscussCard";
import SignStatusCard from "@/components/SignStatusCard";
import UserInfoCard from "@/components/UserInfoCard";
import Link from "next/link";
import { set } from "date-fns";

interface Comment {
  id: number;
  content: string;
  userId: number | null;
  username: string;
  avatar: string;
  parentId: number | null;
  createdAt: string;
  replies?: Comment[]; // 前端嵌套回复
}

const GuesbookPage = () => {
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [promptMessage, setpromptMessage] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [user, setUser] = useState<{
    id: number;
    username: string;
    avatar: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/github/user");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        }
      } catch {
        setpromptMessage("加载用户信息失败，请稍后重试。");
        setStatus("error");
      } finally {
        setStatus("idle");
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments/get?postSlug=guestbook");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const flatComments: Comment[] = data.comments || [];

            // 前端嵌套回复
            const map = new Map<number, Comment>();
            const trees: Comment[] = [];

            flatComments.forEach((c) => {
              map.set(c.id, { ...c, replies: [] });
            });
            flatComments.forEach((c) => {
              const node = map.get(c.id)!;
              if (c.parentId === null) {
                trees.push(node);
              } else {
                const parent = map.get(c.parentId);
                if (parent) {
                  parent.replies!.push(node);
                }
              }
            });
            setComments(trees);
          }
        }
      } catch {
        setpromptMessage("加载评论失败，请稍后重试。");
        setStatus("error");
      }
    };
    fetchComments();
  }, []);

  const onSubmitHandler = async () => {
    if (!message.trim()) {
      setpromptMessage("评论内容不能为空");
      setStatus("error");
      return;
    }
    setpromptMessage("正在提交...");
    setStatus("loading");
    try {
      const res = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message.trim(),
          postSlug: "guestbook",
          parentId: replyToId || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newComment = {
          ...data.comment,
          username: user?.username,
          avatar: user?.avatar,
          replies: [],
        };
        if (replyToId) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === replyToId
                ? { ...c, replies: [...(c.replies || []), newComment] }
                : c,
            ),
          );
        } else {
          setComments((prev) => [newComment, ...prev]);
        }
        setMessage("");
        setReplyToId(null);
        setpromptMessage("评论提交成功");
        setStatus("success");
      } else {
        setpromptMessage(data.message || "提交失败");
        setStatus("error");
      }
    } catch {
      setpromptMessage("网络异常，请稍后重试。");
      setStatus("error");
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setpromptMessage("成功退出登录");
        setStatus("success");
      }
    } catch {
      setpromptMessage("退出登录失败，请稍后重试。");
      setStatus("error");
    }
  };

  const cancelReply = () => {
    setReplyToId(null);
  };

  const ReplyHandler = (id: number) => {
    if (!user) {
      setpromptMessage("请先登录再进行回复");
      setStatus("error");
      return;
    }
    setReplyToId(id);
  };

  const onSaveHandle = async (
    editedUsername: string,
    editedEmail: string,
    editedAvatar: string,
    editedPassword: string,
  ) => {
    setShowUser(false);
    setpromptMessage("正在更新用户信息...");
    setStatus("loading");
    if (!user) return;
    if (!editedUsername.trim() || !editedEmail.trim()) {
      setpromptMessage("用户名和邮箱不能为空");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editedUsername,
          email: editedEmail,
          avatar: editedAvatar,
          password: editedPassword === "********" ? null : editedPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setpromptMessage("用户信息更新成功");
        setStatus("success");
      } else {
        setpromptMessage(data.message || "更新失败");
        setStatus("error");
      }
    } catch {
      setpromptMessage("网络异常，请稍后重试。");
      setStatus("error");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center min-h-screen gap-4 ">
        <div className="w-full max-w-2xl text-center mb-12 pb-8 border-b border-neutral-300">
          <h1 className="text-4xl font-semibold mt-8 mb-6">留言板</h1>
          <p className="text-md">
            欢迎来到我的博客！无论是技术交流还是聊一聊请在下方留言。
          </p>
          <p className="text-md">在这里留下您的足迹吧！</p>
        </div>
        <div className="w-2xl h-52 border bg-white border-neutral-300 rounded-lg dark:bg-white p-4">
          <form className="flex flex-col h-full">
            {replyToId && (
              <div className="mb-2 p-2 bg-blue-50 rounded text-sm flex justify-end items-center">
                <button
                  type="button"
                  onClick={cancelReply}
                  className="text-red-500"
                >
                  取消回复
                </button>
              </div>
            )}
            <textarea
              className="w-full h-32 p-4 rounded-lg bg-neutral-300/20 resize-none outline-none border border-transparent focus:border-blue-400 text-neutral-500"
              placeholder={replyToId ? "回复" : "说点什么吧..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2 items-center">
                {user ? (
                  <>
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      title="点击头像查看个人主页"
                      onClick={() => setShowUser((prev) => !prev)}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full cursor-pointer"
                    />
                    <span className="text-sm dark:text-neutral-800">
                      {user.username}
                    </span>
                  </>
                ) : null}
              </div>
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={onSubmitHandler}
                    disabled={status === "loading" || !message.trim()}
                    className="bg-blue-500 text-sm text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                  >
                    {status === "loading" ? "发送中..." : "发送"}
                  </button>
                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="ml-2 bg-red-500 text-sm text-white px-4 py-1 rounded-lg hover:bg-red-600"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <Link
                  href="/projects/login"
                  className="bg-blue-500 text-sm text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                >
                  登录
                </Link>
              )}
            </div>
          </form>
        </div>
        {/* 评论列表 */}

        <div className="w-full max-w-2xl flex flex-col gap-6">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              还没有留言，快来抢沙发吧～
            </p>
          ) : (
            comments.map((comment) => (
              <DiscussCard
                key={comment.id}
                comment={comment}
                userId={user?.id || null}
                onReply={ReplyHandler}
              />
            ))
          )}
        </div>
      </div>
      {status !== "idle" && (
        <SignStatusCard
          status={
            status === "loading"
              ? "loading"
              : status === "success"
                ? "success"
                : "error"
          }
          message={promptMessage}
          onClose={() => setStatus("idle")}
          autoClose={status === "success" ? 2000 : 4000}
        />
      )}
      {showUser && (
        <UserInfoCard
          userInfo={user}
          onSave={onSaveHandle}
          onClose={() => setShowUser(false)}
        />
      )}
    </>
  );
};

export default GuesbookPage;
