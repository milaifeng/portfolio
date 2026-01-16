"use client";
import { useRef, useState, useEffect } from "react";

const Terminal = () => {
  const [inputText, setInputText] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1); // 初始 -1，更标准
  const [history, setHistory] = useState<
    {
      input: string;
      output: string[];
    }[]
  >([
    {
      input: "help",
      output: [
        "Available commands:",
        "about     Show user information",
        "welcome   Show welcome message",
        "contact   Show email",
        "clear     Clear terminal screen",
        "help      Show this help message",
      ],
    },
  ]);

  const editableRef = useRef<HTMLSpanElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null); // 新增：用于控制滚动

  // 自动滚到底部
  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, inputText]); // history 变化或输入变化时滚到底

  // 同步输入内容到状态，并保持光标在末尾
  const handleInput = () => {
    if (editableRef.current) {
      const text = editableRef.current.innerText || "";
      setInputText(text);
    }
  };

  // 当浏览历史替换输入时，更新 editableRef 并保持光标末尾
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.innerText = inputText;

      // 光标移到末尾
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [inputText]);

  const commands = (input: string) => {
    const trimmed = input.trim();
    switch (trimmed) {
      case "help":
        return [
          "Available commands:",
          "about     Show user information",
          "welcome   Show welcome message",
          "contact   Show email",
          "clear     Clear terminal screen",
          "help      Show this help message",
        ];
      case "about":
        return ["mlf", "front-end developer"];
      case "welcome":
        return ["welcome to mlf blog"];
      case "contact":
        return ["Email: 2691708883@email.com"];
      case "clear":
        setHistory([]);
        return [];
      default:
        return [`command not found: ${trimmed}`];
    }
  };

  const handleCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return; // 空命令不记录

    const cmd = commands(trimmed);
    setHistory((prev) => [...prev, { input: trimmed, output: cmd }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 关键：阻止 <br> 插入和默认换行

      const command = inputText.trim();
      handleCommand(command);

      setInputText("");
      setHistoryIndex(-1);

      // 清空 editableRef
      if (editableRef.current) {
        editableRef.current.innerText = "";
      }

      scrollToBottom(); // 立即滚动（保险）
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      if (history.length === 0) return;

      let newIndex: number;
      if (historyIndex === -1) {
        newIndex = history.length - 1;
      } else if (historyIndex > 0) {
        newIndex = historyIndex - 1;
      } else {
        return;
      }

      setHistoryIndex(newIndex);
      setInputText(history[newIndex].input);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();

      if (historyIndex === -1) return;

      let newIndex: number;
      if (historyIndex < history.length - 1) {
        newIndex = historyIndex + 1;
      } else {
        newIndex = -1;
      }

      setHistoryIndex(newIndex);
      setInputText(newIndex === -1 ? "" : history[newIndex].input);
    }
  };

  return (
    <div
      className="w-full max-w-2xl bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow focus-within:shadow-xl border border-neutral-200 dark:border-neutral-800"
      onClick={() => editableRef.current?.focus()}
      tabIndex={-1}
    >
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
        ref={terminalRef}
        className="h-72 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-y-auto font-mono text-sm leading-relaxed px-4 py-3 flex flex-col"
      >
        {/* 历史命令：始终显示输入行，即使 output 为空 */}
        {history.map((item, index) => (
          <div key={index} className="flex flex-col">
            {/* 输入行 */}
            <div className="flex flex-wrap items-center text-[16px] text-neutral-500">
              <span className="text-[#B85CF6] mr-1 shrink-0">mlf@blog$</span>
              <span>{item.input}</span>
            </div>

            {/* 输出行：只有有内容时显示 */}
            {item.output.length > 0 && (
              <div className="ml-4 text-[16px] text-neutral-500">
                {/* 可选缩进 */}
                {item.output.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="leading-normal whitespace-pre"
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 当前输入行 */}
        <div className="flex flex-wrap items-center text-[16px] min-w-0">
          <span className="text-[#B85CF6] mr-1">mlf@blog$</span>
          <span
            ref={editableRef}
            className="outline-none whitespace-pre inline min-w-px max-w-full  text-neutral-500 caret-transparent"
            contentEditable="true"
            spellCheck={false}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");
              document.execCommand("insertText", false, text);
            }}
          />
          <span className="w-2 h-4 block bg-neutral-900 dark:bg-white animate-[blink-steps_1s_steps(1,end)_infinite] cursor-text" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
