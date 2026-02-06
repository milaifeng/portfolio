"use client";
import Image from "next/image";
import Link from "next/link";
import gitHub from "@/public/github.png";
import google from "@/public/google.svg";
import qq from "@/public/QQ.svg";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const SignInForm = ({ isActive }: { isActive: boolean }) => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const loginGithub = async () => {
    const response = await fetch("/api/auth/github/login");
    const data = await response.json();
    if (!data.authUrl) {
      return;
    }
    window.location.assign(data.authUrl);
  };

  const loginPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // 登录成功，跳转到留言板或其他页面
        router.push("/guestbook");
        // 可选：刷新 session 或全局状态
      } else {
        alert(data.message || "登录失败");
      }
    } catch {
      alert("网络错误");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!code && !returnedState) return;
    const handleCallback = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/github/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, returnedState }),
        });
        if (!response.ok) {
          throw new Error("登录失败");
        }
        const data = await response.json();
        if (data.success) {
          router.replace("/guesbook");
        }
      } catch {
        alert("登录失败，请重试！");
      } finally {
        setLoading(false);
      }
    };
    handleCallback();
  }, [code, returnedState, router]);
  return loading ? (
    <Loading />
  ) : (
    <div
      className={`absolute inset-y-0 left-0 w-1/2 flex items-center justify-center transition-all duration-600 ease-in-out z-20 ${isActive ? "translate-x-full opacity-0" : "translate-x-0"}`}
    >
      <form className=" w-full flex flex-col gap-6 h-full px-4 justify-center items-center">
        <h1 className="font-semibold text-2xl text-neutral-700 dark:text-neutral-300">
          用户登录
        </h1>
        <div className="flex gap-8">
          <button
            onClick={loginGithub}
            type="button"
            className="size-10 cursor-pointer rounded-xl border border-neutral-300 flex items-center justify-center p-2 hover:bg-neutral-200/50 transition"
          >
            <Image src={gitHub} alt="github" height={26} />
          </button>
          <button
            onClick={() => {}}
            type="button"
            className="size-10 cursor-pointer rounded-xl border border-neutral-300 flex items-center justify-center p-2 hover:bg-neutral-200/50 transition"
          >
            <Image src={google} alt="google" height={26} />
          </button>
          <button
            onClick={() => {}}
            type="button"
            className="size-10 cursor-pointer rounded-xl border border-neutral-300 flex items-center justify-center p-2 hover:bg-neutral-200/50 transition"
          >
            <Image
              src={qq}
              alt="qq"
              height={26}
              width={26}
              className="size-8"
            />
          </button>
        </div>
        <p className="dark:text-neutral-300">使用第三方账号登录</p>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border-b border-neutral-300 outline-none p-2"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b border-neutral-300 outline-none p-2"
        />
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-xl cursor-pointer"
          type="button"
          onClick={loginPassword}
        >
          登录
        </button>
        <Link className="text-xs" href="#">
          忘记密码？
        </Link>
      </form>
    </div>
  );
};

export default SignInForm;
