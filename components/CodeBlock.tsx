"use client";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa6";

/** How long the check mark stays before the button settles back. */
const RESET_MS = 2000;

// Easing: things arriving use ease-out (starts fast, settles), things leaving
// use ease-in and a shorter time (clears out of the way). The timing sits on
// the *destination* state, so entering and leaving can differ on one element.
//
// The button fades in on hover or keyboard focus (:focus-visible, so a mouse
// click does not pin it open), stays while confirming, and is always visible on
// devices that cannot hover (touch).
const BUTTON =
  "group/copy absolute top-2 right-2 rounded-md bg-zinc-200/90 p-2 text-sm text-zinc-600 opacity-0 transition-opacity duration-[120ms] ease-in dark:bg-zinc-800/90 dark:text-zinc-400 " +
  "group-hover/block:opacity-100 group-hover/block:duration-200 group-hover/block:ease-out " +
  "group-has-[:focus-visible]/block:opacity-100 group-has-[:focus-visible]/block:duration-200 group-has-[:focus-visible]/block:ease-out " +
  "data-[copied=true]:opacity-100 data-[copied=true]:duration-200 data-[copied=true]:ease-out " +
  "[@media(hover:none)]:opacity-100";

// The two icons cross-fade and scale inside the button. The clipboard waits
// 100ms before returning: if the pointer has left, the whole button is already
// fading out (120ms) and the clipboard must not peek through; if the pointer is
// still inside it reads as check out, then clipboard in.
const COPY_ICON =
  "absolute inset-0 size-full scale-100 opacity-100 transition delay-100 duration-200 ease-out " +
  "group-data-[copied=true]/copy:scale-50 group-data-[copied=true]/copy:opacity-0 group-data-[copied=true]/copy:delay-0 group-data-[copied=true]/copy:duration-[120ms] group-data-[copied=true]/copy:ease-in";
const CHECK_ICON =
  "absolute inset-0 size-full scale-50 text-accent opacity-0 transition duration-[120ms] ease-in " +
  "group-data-[copied=true]/copy:scale-100 group-data-[copied=true]/copy:opacity-100 group-data-[copied=true]/copy:duration-200 group-data-[copied=true]/copy:ease-out";

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
    <div className="group/block relative">
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a horizontally scrollable code block must be reachable by keyboard so it can be scrolled. */}
      <pre ref={preRef} tabIndex={0} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        data-copied={copied ? "true" : "false"}
        data-ready={ready ? "true" : undefined}
        className={BUTTON}
      >
        <span
          aria-hidden="true"
          className="relative block size-[1em] transition-transform duration-100 ease-out group-active/copy:scale-90"
        >
          <FaRegCopy className={COPY_ICON} />
          <FaCheck className={CHECK_ICON} />
        </span>
      </button>
      <output className="sr-only">{copied ? "Code copied" : ""}</output>
    </div>
  );
};
