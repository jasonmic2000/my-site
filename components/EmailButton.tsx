"use client";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaEnvelope } from "react-icons/fa6";
import { HOVER_TRANSITION_CLASS, ICON_PRESS_CLASS } from "@/lib/consts";
import { getEmail } from "@/lib/email";

/** How long the "copied" popup stays before it fades out by itself. */
const POPUP_MS = 2200;

// Both icons are stacked and cross-faded (same technique as ThemeToggle).
const ICON = "absolute inset-0 size-full transition duration-200 ease-out";

/**
 * The envelope in the contact icon row (render it inside the `<ul>`).
 * The address is not in the page until the visitor clicks: it is decoded and
 * copied, the icon turns into a check mark, and a small popup to the right
 * says so, then fades away. Only if copying is blocked is the address shown
 * (as a mailto link) so the visitor still gets it.
 */
export const EmailButton = () => {
  const [open, setOpen] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [fallback, setFallback] = useState<string | null>(null);
  // Set after hydration so tests (and impatient clicks) can tell handlers are live.
  const [ready, setReady] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setReady(true);
    return () => window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    const email = getEmail();
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setFallback(null);
      setOpen(true);
      setAnnounce("Email address copied to clipboard");
      timer.current = window.setTimeout(() => {
        setOpen(false);
        // Cleared so the next copy is announced again.
        setAnnounce("");
      }, POPUP_MS);
    } catch {
      setOpen(false);
      setFallback(email);
      setAnnounce("Could not copy automatically. The address is shown below.");
    }
  };

  return (
    <>
      <li
        className={`relative flex text-nowrap pr-2 text-xl ${HOVER_TRANSITION_CLASS}`}
      >
        <button
          type="button"
          onClick={copy}
          aria-label="Copy email address"
          title={open ? undefined : "Copy email address"}
          data-ready={ready ? "true" : undefined}
          className={`flex ${ICON_PRESS_CLASS}`}
        >
          <span aria-hidden="true" className="relative block size-[1em]">
            <FaEnvelope
              className={`${ICON} ${open ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
            />
            <FaCheck
              className={`${ICON} text-accent ${open ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            />
          </span>
        </button>
        {/* Visual confirmation only; screen readers get the <output> below. */}
        <span
          aria-hidden="true"
          data-open={open}
          className="pointer-events-none absolute top-1/2 left-full ml-1 origin-left -translate-x-1 -translate-y-1/2 scale-95 whitespace-nowrap rounded-md border border-zinc-300 bg-background px-2.5 py-1 text-foreground text-sm opacity-0 shadow-sm transition duration-200 ease-out data-[open=true]:translate-x-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 dark:border-zinc-700"
        >
          Email copied
        </span>
        {/* Rendered empty first so screen readers announce it when it fills. */}
        <output className="sr-only">{announce}</output>
      </li>
      {fallback && (
        <li className="basis-full pt-4 text-base">
          Could not copy automatically:{" "}
          <a
            href={`mailto:${fallback}`}
            className={`underline underline-offset-4 ${HOVER_TRANSITION_CLASS}`}
          >
            {fallback}
          </a>
        </li>
      )}
    </>
  );
};
