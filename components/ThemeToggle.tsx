"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative w-10 h-6 border rounded-2xl p-0 hover:cursor-pointer hover:border-[#B85CF6] justify-start ${
        theme === "light"
          ? "bg-gray-500/10 border-[#c2c2c4]"
          : "bg-[#657585] border-[#3c3f44]"
      }`}
    >
      <span
        className={`transform transition-transform duration-500 ease-in-out w-4.5 h-4.5 rounded-full flex items-center justify-center ${
          theme === "light"
            ? "translate-x-0.5 bg-white"
            : "translate-x-4 bg-black"
        }`}
      >
        {theme === "light" ? (
          <Sun size={12} className="w-3 h-3 text-[#67676c]" />
        ) : (
          <Moon size={12} className=" w-3 h-3 text-white" />
        )}
      </span>
    </Button>
  );
};

export default ThemeToggle;
