import Image from "next/image";
import Link from "next/link";
import gitHub from "@/public/github.png";
import gmail from "@/public/gmail.png";
import weChat from "@/public/wechat.svg";

const SignInForm = () => {
  return (
    <div className="w-1/2">
      <form
        action="#"
        className="flex flex-col gap-6 h-full px-4 justify-center items-center"
      >
        <h1 className="font-semibold text-2xl text-neutral-700">用户登录</h1>
        <div className="flex gap-8">
          <Link href="#">
            <Image src={gitHub} alt="github" height={26} />
          </Link>
          <Link href="#">
            <Image src={gmail} alt="gmail" height={26} />
          </Link>
          <Link href="#">
            <Image src={weChat} alt="wechat" height={26} />
          </Link>
        </div>
        <p>使用第三方账号登录</p>
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
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-xl cursor-pointer"
          type="submit"
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
