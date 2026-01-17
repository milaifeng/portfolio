import Link from "next/link";
import Image from "next/image";
import gitHub from "@/public/github.png";
import gmail from "@/public/gmail.png";
import weChat from "@/public/wechat.svg";
const SignUpform = () => {
  return (
    <div className="w-1/2 flex flex-col gap-6 h-full px-4 justify-center items-center">
      <h1 className="font-semibold text-2xl text-neutral-700">用户注册</h1>
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
      <p>使用第三方账号注册</p>
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
            className="w-2/3 outline-none"
          />
          <div className="w-1/3 bg-blue-500 text-white text-center px-4 py-2 rounded-xl cursor-pointer">
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
