"use client";

import { useEffect } from "react";
import { CircleCheckIcon, XCircle, Loader2 } from "lucide-react";

type StatusType = "loading" | "success" | "error";

interface SignStatusProps {
  status: StatusType;
  message?: string;
  onClose?: () => void;
  autoClose?: number;
}

const SignStatusCard = ({
  status,
  message = "",
  onClose,
  autoClose = 3000,
}: SignStatusProps) => {
  useEffect(() => {
    if (status !== "loading" && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [status, autoClose, onClose]);

  const statusConfig = {
    loading: {
      bg: "bg-blue-500",
      icon: <Loader2 className="h-6 w-6 animate-spin" />,
      text: message || "加载中...",
    },
    success: {
      bg: "bg-green-500",
      icon: <CircleCheckIcon className="h-6 w-6" />,
      text: message || "登录成功！",
    },
    error: {
      bg: "bg-red-500",
      icon: <XCircle className="h-6 w-6" />,
      text: message || "登录失败，请重试",
    },
  };

  const config = statusConfig[status];
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-60 pointer-events-none">
      <div
        className={`
      px-6 py-3.5 rounded-xl shadow-xl
      flex items-center gap-3.5 text-white font-medium
      ${config.bg}
      min-w-65 max-w-[90vw] md:max-w-130
      whitespace-normal wrap-break-words text-center sm:text-left
      transition-all duration-300
    `}
      >
        {config.icon}
        <span className="flex-1">{config.text}</span>
      </div>
    </div>
  );
};

export default SignStatusCard;
