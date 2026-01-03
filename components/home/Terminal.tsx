"use client";
import { useEffect, useRef, useState } from "react";

const Terminal = () => {
  const [history, setHistory] = useState<
    { type: "output" | "input"; content: string }[]
  >([
    { type: "input", content: "welcome to mlf blog" },
    { type: "input", content: "help" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // 预定义命令映射（你可以自由扩展）
  const commands: Record<string, (args: string[]) => string | string[]> = {
    help: () => [
      "<span class='text-cyan-400'>Available commands:</span>",
      "projects Show my project",
      "about Show user information",
      "blog  Show blog statistics",
      "contact Show email",
      "clear Clear terminal screen",
      "help Show this help history",
    ],
    about: () => ["mlf", "front-end developers"],
    projects: () => [
      "<span class='text-cyan-400'>我的代表项目：</span>",
      "• 项目1 - 描述（链接: <a href='/projects/1' class='text-blue-400 underline'>查看详情</a>）",
      "• 项目2 - 描述（链接: <a href='/projects/2' class='text-blue-400 underline'>查看详情</a>）",
      "输入 <span class='text-green-400'>projects</span> + 项目名 查看更多",
    ],
    blog: () => [
      "<span class='text-cyan-400'>最近博客：</span>",
      "• 《Next.js 最佳实践》 - 2025/12",
      "• 《TailwindCSS 高级技巧》 - 2025/11",
      "前往 <a href='/blog' class='text-blue-400 underline'>/blog</a> 查看全部",
    ],
    contact: () => [
      "<span class='text-cyan-400'>联系我：</span>",
      "• Email: your@email.com",
      "• GitHub: <a href='https://github.com/yourname' class='text-blue-400 underline'>github.com/yourname</a>",
      "• Twitter/X: <a href='https://twitter.com/yourname' class='text-blue-400 underline'>@yourname</a>",
    ],
    clear: () => {
      setHistory([]);
      return [];
    },
  };

  const handleCommand = (input: string) => {
    const trimmed = input.trim();
    const [cmd, ...args] = trimmed.split(" ");

    // 添加输入记录
    setHistory((prev) => [...prev, { type: "input", content: trimmed }]);

    if (!trimmed) {
      setHistory((prev) => [...prev, { type: "output", content: "" }]);
      return;
    }

    // 添加到命令历史
    setCommandHistory((prev) => [trimmed, ...prev]);

    const lowerCmd = cmd.toLowerCase();
    if (commands[lowerCmd]) {
      const result = commands[lowerCmd](args);
      const lines = Array.isArray(result) ? result : [result];
      setHistory((prev) => [
        ...prev,
        ...lines.map((line) => ({ type: "output", content: line })),
        { type: "output", content: "" },
      ]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: "output",
          content: `<span class='text-red-400'>command not found: ${cmd}</span>`,
        },
        { type: "output", content: "" },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
      setCurrentInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

  // 自动滚动到底部 + 聚焦输入框
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [history]);
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          welcome.js
        </div>
      </div>
      <div
        ref={containerRef}
        className="h-72 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-y-auto font-mono text-sm leading-relaxed px-4 py-3"
      >
        {/* 历史输出 */}
        {history.map((item, i) => (
          <div key={i} className="mb-1">
            {item.type === "input" ? (
              <span>
                <span className="text-green-400">mlf@blog$</span> {item.content}
              </span>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            )}
          </div>
        ))}

        {/* 当前输入行 */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">mlf@blog$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-neutral-900 dark:text-neutral-100"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          {/* 闪烁光标 */}
          <span className="inline-block w-2 h-5 bg-green-400 animate-pulse ml-1" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
