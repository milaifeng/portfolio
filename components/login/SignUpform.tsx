"use client";
import Image from "next/image";
import gitHub from "@/public/github.png";
import google from "@/public/google.svg";
import qq from "@/public/QQ.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignStatusCard from "../SignStatusCard";
const SignUpform = ({ isActive }: { isActive: boolean }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const onSignUpClick = async () => {
    setMessage(""); // 清空错误
    if (!userName || !passWord || !email || !captcha) {
      setStatus("error");
      setMessage("请填写所有字段");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          password: passWord,
          email,
          captcha,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("注册成功！");
        setTimeout(() => {
          router.push("/guestbook");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "注册失败");
        loadCaptcha(); // 刷新验证码
      }
    } catch {
      setStatus("error");
      setMessage("网络错误");
      loadCaptcha();
    }
  };

  const loadCaptcha = async () => {
    try {
      const res = await fetch("/api/captcha");
      if (!res.ok) throw new Error("加载失败");
      const svgText = await res.text();
      setCaptchaSvg(svgText);
    } catch {
      setStatus("error");
      setMessage("验证码加载失败");
      setCaptchaSvg("加载失败");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);
  return (
    <>
      <div
        className={`absolute inset-y-0 left-0 w-1/2 flex flex-col gap-6 h-full px-4 justify-center items-center transition-all duration-600 ease-in-out 
        ${isActive ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"}`}
      >
        <h1 className="font-semibold text-2xl text-neutral-700 dark:text-neutral-300">
          用户注册
        </h1>
        <div className="flex gap-8">
          <button
            onClick={() => {}}
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
        <form className="flex w-full flex-col justify-center items-center gap-2">
          <input
            type="text"
            placeholder="用户名"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            className="w-full border-b border-neutral-300 outline-none p-2"
          />
          <input
            type="password"
            placeholder="密码"
            value={passWord}
            onChange={(e) => {
              setPassWord(e.target.value);
            }}
            className="w-full border-b border-neutral-300 outline-none p-2"
          />
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full border-b border-neutral-300 outline-none p-2"
          />
          <div className="w-full flex items-center justify-between border-b border-neutral-300 px-2">
            <input
              type="text"
              placeholder="验证码"
              value={captcha}
              onChange={(e) => {
                setCaptcha(e.target.value);
              }}
              className="outline-none"
            />
            <div
              onClick={loadCaptcha}
              dangerouslySetInnerHTML={{ __html: captchaSvg }}
              className="cursor-pointer"
              title="点击刷新验证码"
            />
          </div>
          <button
            className="bg-blue-500 w-20 text-white mt-4 px-6 py-2 rounded-xl cursor-pointer"
            onClick={onSignUpClick}
            type="button"
          >
            注册
          </button>
        </form>
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
          message={message}
          onClose={() => setStatus("idle")}
          autoClose={status === "success" ? 2000 : 4000}
        />
      )}
    </>
  );
};

export default SignUpform;
