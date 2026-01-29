import Link from "next/link";
import Image from "next/image";
import gitHub from "@/public/github.png";
import google from "@/public/google.svg";
import qq from "@/public/QQ.svg";
const SignUpform = ({ isActive }: { isActive: boolean }) => {
  return (
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
          <Image src={qq} alt="qq" height={26} width={26} className="size-8" />
        </button>
      </div>
      <p className="dark:text-neutral-300">使用第三方账号登录</p>
      <form
        action="#"
        className="flex w-full flex-col justify-center items-center gap-2"
      >
        <input
          type="text"
          placeholder="用户名"
          className="w-full border-b border-neutral-300 outline-none p-2"
        />
        <input
          type="password"
          placeholder="密码"
          className="w-full border-b border-neutral-300 outline-none p-2"
        />
        <input
          type="email"
          placeholder="邮箱"
          className="w-full border-b border-neutral-300 outline-none p-2"
        />
        <div className="w-full flex border-b border-neutral-300 p-2">
          <input
            type="text"
            placeholder="验证码"
            className="w-3/5 outline-none"
          />
          <div className="w-2/5 bg-blue-500 text-white text-center px-4 py-2 rounded-xl cursor-pointer">
            获取验证码
          </div>
        </div>
        <button
          className="bg-blue-500 w-20 text-white mt-4 px-6 py-2 rounded-xl cursor-pointer"
          type="submit"
        >
          注册
        </button>
      </form>
    </div>
  );
};

export default SignUpform;
