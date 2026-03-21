"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SearchButton from "@/components/home/Search";
import ThemeToggle from "@/components/ThemeToggle";

import { useTheme } from "next-themes";
import logoDark from "@/public/logo.svg";
import logoLight from "@/public/logo-light.svg";
import { useState } from "react";
const items = [
  { id: 0, label: "首页", href: "/" },
  { id: 1, label: "博客", href: "/blogs" },
  { id: 2, label: "留言", href: "/guestbook" },
];
const Header = () => {
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-gray-300 shadow-xs bg-white dark:border-[#000000] dark:bg-[#1b1b1f] transition-colors duration-300 z-100">
      <div className="max-w-5xl mx-auto flex justify-between h-18 items-center px-4 sm:px-6">
        {/* Logo */}
        <Link href="/">
          <Image
            src={theme === "light" ? logoDark : logoLight}
            alt="logo"
            height={60}
          />
        </Link>

        <div className="flex gap-6 items-center">
          <div className="hidden md:flex gap-6 items-center">
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
            <SearchButton />
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <SearchButton />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-[#B85CF6] hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1b1b1f] border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`block px-3 py-2 rounded-md ${path === item.href ? "text-[#B85CF6] font-bold bg-gray-100 dark:bg-gray-800" : "text-gray-500 hover:text-[#B85CF6] hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
