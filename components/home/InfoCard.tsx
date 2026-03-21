import Image from "next/image";
import user from "@/public/user.jpg";
import { Mail, BookOpen, Github } from "lucide-react";
import Link from "next/link";
const InfoCard = () => {
  return (
    <div className="hidden md:flex h-86 w-60 border border-neutral-200 dark:border-neutral-800 bg-white  dark:bg-neutral-900 shadow-md p-6 rounded-xl flex-col items-center gap-2">
      <Image
        src={user}
        alt="头像"
        width={64}
        height={64}
        className="w-16 h-16 rounded-full"
      />
      <span className="w-full mb-2 text-center text-neutral-500">
        Find me on
      </span>
      <div className="w-full flex flex-col items-center mt-2 gap-2">
        <Link
          href="https://github.com/milaifeng"
          className="w-full h-10 flex justify-center items-center"
        >
          <Github size={24} className="w-6 h-6 text-neutral-500" />
        </Link>
        <Link
          href="https://mail.google.com/"
          className="w-full h-10 flex justify-center items-center"
        >
          <Mail size={24} className="w-6 h-6 text-neutral-500" />
        </Link>
        <Link
          href="/guestbook"
          className="w-full h-10 flex justify-center items-center"
        >
          <BookOpen size={24} className="w-6 h-6 text-neutral-500" />
        </Link>
      </div>
    </div>
  );
};

export default InfoCard;
