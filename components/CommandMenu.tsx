"use client";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FiSearch } from "react-icons/fi";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

// The dialog (list, filtering, fetch) is a separate chunk: it loads when the
// menu is first opened, or earlier on hover/focus of the trigger.
const loadDialog = () => import("@/components/CommandMenuDialog");
const CommandMenuDialog = lazy(loadDialog);

const subscribe = () => () => {};
const getIsMac = () => {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  return /mac|iphone|ipad|ipod/i.test(
    nav.userAgentData?.platform ?? navigator.platform ?? "",
  );
};

/** True for Mac/iOS (shows the Command symbol). Server and first paint assume false. */
const useIsMac = () => useSyncExternalStore(subscribe, getIsMac, () => false);

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isMac = useIsMac();
  const shortcut = isMac ? "⌘ K" : "Ctrl K";

  const show = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const inMenu =
        event.target instanceof Element && event.target.closest("[data-cmdk]");

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        // Don't steal the shortcut from other text fields on the page.
        if (isTypingTarget(event.target) && !inMenu) return;
        event.preventDefault();
        setMounted(true);
        setOpen((current) => !current);
        return;
      }
      if (
        key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !inMenu &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Open command menu (${shortcut})`}
        aria-keyshortcuts="Control+K Meta+K"
        onClick={show}
        onPointerEnter={loadDialog}
        onFocus={loadDialog}
        className={`flex items-center justify-center ${HOVER_TRANSITION_CLASS}`}
      >
        <FiSearch aria-hidden="true" className="sm:hidden" />
        {/* Fixed width so Mac and Windows labels take the same space (no shift). */}
        <span
          aria-hidden="true"
          className="hidden min-w-[3.5rem] justify-center rounded-md border border-zinc-400 px-1.5 py-0.5 font-mono text-xs sm:inline-flex dark:border-zinc-600"
        >
          {shortcut}
        </span>
      </button>
      {mounted && (
        <Suspense fallback={null}>
          <CommandMenuDialog
            open={open}
            onClose={close}
            returnFocusTo={triggerRef}
          />
        </Suspense>
      )}
    </>
  );
};
