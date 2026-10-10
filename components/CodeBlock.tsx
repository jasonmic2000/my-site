"use client";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { ICON_PRESS_CLASS } from "@/lib/consts";

const RESET_MS = 2000;

/**
 * Replaces `<pre>` in posts: adds a copy button, and makes the block
 * keyboard-scrollable. Everything else (highlighting, titles, line numbers)
 * is rehype-pretty-code's output, passed through unchanged.
 */
export const CodeBlock = ({ children, ...props }: ComponentProps<"pre">) => {
  const preRef = useRef<HTMLPreElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  // Set after hydration so tests (and impatient clicks) can tell handlers are live.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    return () => window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    const text = preRef.current?.textContent?.replace(/\n$/, "") ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), RESET_MS);
  };

  return (
    <div className="relative">
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a horizontally scrollable code block must be reachable by keyboard so it can be scrolled. */}
      <pre ref={preRef} tabIndex={0} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        data-ready={ready ? "true" : undefined}
        className={`absolute top-2 right-2 rounded-md bg-zinc-200/90 p-2 text-sm text-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-400 ${ICON_PRESS_CLASS}`}
      >
        {copied ? (
          <FaCheck aria-hidden="true" className="text-accent" />
        ) : (
          <FaRegCopy aria-hidden="true" />
        )}
      </button>
      <output className="sr-only">{copied ? "Code copied" : ""}</output>
    </div>
  );
};
