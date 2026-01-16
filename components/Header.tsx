"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

import { useTheme } from "next-themes";
import logoDark from "@/public/logo.svg";
import logoLight from "@/public/logo-light.svg";
const items = [
  { id: 0, label: "首页", href: "/" },
  { id: 1, label: "博客", href: "/blogs" },
  { id: 2, label: "项目", href: "/projects" },
  { id: 3, label: "留言", href: "/guesbook" },
];
const Header = () => {
  const path = usePathname();
  const { theme } = useTheme();
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-gray-300 shadow-xs bg-white dark:border-[#000000] dark:bg-[#1b1b1f] transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between h-18 items-center px-6">
        {theme === "light" ? (
          <Link href="/">
            <Image src={logoDark} alt="logo" height={60} />
          </Link>
        ) : (
          <Link href="/">
            <Image src={logoLight} alt="logo" height={60} />
          </Link>
        )}

        <div className="flex gap-6 items-center">
          <ul className="flex font-normal items-center justify-center gap-8 text-gray-500 ">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  className={`${
                    path === item.href &&
                    "text-[#B85CF6] font-bold border-b-2 px-2 py-3"
                  } hover:text-[#B85CF6]`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button className="w-25 justify-start gap-4 border border-gray-500 rounded-3xl text-gray-500">
            <Search />
            <span>搜索</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
