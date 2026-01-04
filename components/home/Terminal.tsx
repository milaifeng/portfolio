"use client";

import { useRef, useState, useEffect } from "react";

const Terminal = () => {
  const [inputText, setInputText] = useState("");
  const editableRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = inputText;

      // 保持光标在末尾
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false); // false = 移到末尾
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [inputText]);
  const handleInput = () => {
    if (editableRef.current) {
      setInputText(editableRef.current.textContent || "");
    }
  };
  // const commands: Record<string, (args: string[]) => string | string[]> = {
  //   help: () => [
  //     "Available commands:",
  //     "about Show user information",
  //     "welcome  Show welcome message",
  //     "contact Show email",
  //     "clear Clear terminal screen",
  //     "help Show this help history",
  //   ],
  //   about: () => ["mlf", "front-end developers"],
  //   welcome: () => ["welcome to mlf blog"],
  //   contact: () => ["Email: 2691708883@email.com"],
  //   clear: () => {
  //     return [];
  //   },
  // };

  return (
    <div
      className="w-full max-w-2xl bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-md focus-within:shadow-xl border border-neutral-200 dark:border-neutral-800"
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
      <div className="h-72 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-y-auto font-mono text-sm leading-relaxed px-4 py-3">
        <div className="flex flex-wrap text-[16px] items-center">
          <span className="text-[#B85CF6] mr-1">mlf@blog$</span>
          <span
            ref={editableRef}
            className="outline-none whitespace-pre-wrap break-word inline min-w-px max-w-full border-none caret-transparent"
            contentEditable="true"
            spellCheck={false}
            onInput={handleInput}
          ></span>
          <span className="w-2 h-4 block bg-neutral-900 dark:bg-white animate-[blink-steps_1s_steps(1,end)_infinite] cursor-text"></span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
