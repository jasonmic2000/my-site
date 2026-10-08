"use client";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

// Both icons are always rendered and swapped with CSS `dark:` variants, so the
// right one shows from first paint (the theme class is set before hydration)
// and there is no mismatch to reconcile. The turn/scale transition is covered
// by the global prefers-reduced-motion rule in globals.css.
const ICON = "absolute inset-0 size-full transition duration-300 ease-in-out";

export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      className={`flex items-center justify-center ${HOVER_TRANSITION_CLASS}`}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="relative block size-[1em]" aria-hidden="true">
        <FiMoon
          className={`${ICON} rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0`}
        />
        <FiSun
          className={`${ICON} rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`}
        />
      </span>
      {/* The accessible name describes the action, and also flips with CSS. */}
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to light theme</span>
    </button>
  );
};
