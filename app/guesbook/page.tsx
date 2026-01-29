"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import DiscussCard from "@/components/guesbook/DiscussCard";
import Loading from "@/components/Loading";
const GuesbookPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    name: string;
    avatar: string;
    login: string;
  } | null>(null);
  const onSubmitHandler = () => {
    console.log(message);
  };
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/github/user");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-center min-h-screen gap-4 ">
      <div className="w-full max-w-2xl text-center mb-12 pb-8 border-b border-neutral-300">
        <h1 className="text-4xl font-semibold mt-8 mb-6">留言板</h1>
        <p className="text-md">
          欢迎来到我的博客！无论是技术交流还是聊一聊请在下方留言。
        </p>
        <p className="text-md">在这里留下您的足迹吧！</p>
      </div>
      <div className="w-2xl h-56 border bg-white border-neutral-300 rounded-lg dark:bg-white p-4">
        <form onSubmit={onSubmitHandler} className="flex flex-col h-full">
          <textarea
            className="w-full h-32 p-4 rounded-lg bg-neutral-300/20 resize-none outline-none border border-transparent focus:border-blue-400 text-neutral-500"
            placeholder="请输入您的留言..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2 items-center">
              <Image
                src={user?.avatar || "/user.jpg"}
                alt={user?.name || "匿名用户"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <span className="text-sm dark:text-neutral-800">
                {user?.name || "匿名用户"}
              </span>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-sm text-white px-4 py-1 rounded-lg hover:bg-blue-600"
            >
              发送
            </button>
          </div>
        </form>
      </div>
      <DiscussCard />
    </div>
  );
};

export default GuesbookPage;
