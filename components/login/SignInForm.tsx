import Image from "next/image";
import Link from "next/link";
import gitHub from "@/public/github.png";
import gmail from "@/public/gmail.png";
import weChat from "@/public/wechat.svg";

const SignInForm = () => {
  return (
    <div>
      <form action="#">
        <h1>用户登录</h1>
        <div className="flex gap-4">
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
        <input type="text" />
        <input type="password" />
        <button type="submit">登录</button>
        <Link href="#">忘记密码？</Link>
      </form>
    </div>
  );
};

export default SignInForm;
