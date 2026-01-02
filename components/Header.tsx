"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

import { useTheme } from "next-themes";
import logoDrak from "@/public/logo.svg";
import logoLight from "@/public/logo-light.svg";
const items = [
  { id: 0, label: "首页", href: "/" },
  { id: 1, label: "博客", href: "/blog" },
  { id: 2, label: "项目", href: "/projects" },
  { id: 3, label: "留言", href: "/message" },
];
const Header = () => {
  const path = usePathname();
  const { theme } = useTheme();
  console.log(path);
  return (
    <header className="border-b border-gray-300 shadow-xs dark:border-[#000000]">
      <div className="max-w-6xl mx-auto flex justify-between h-18 items-center px-6">
        <Link href="/">
          <Image
            src={theme === "light" ? logoDrak : logoLight}
            alt="logo"
            height={60}
          />
        </Link>

        <div className="flex gap-6 items-center">
          <ul className="flex font-normal items-center justify-center gap-8">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  className={`${
                    path === item.href &&
                    "text-[#B85CF6] font-bold border-b-2 px-2 py-3"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button className="w-25 justify-start gap-4 border border-gray-300 rounded-3xl">
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
