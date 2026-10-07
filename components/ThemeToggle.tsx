"use client";
import { useTheme } from "next-themes";
import { FiMoon } from "react-icons/fi";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={`flex items-center justify-center ${HOVER_TRANSITION_CLASS}`}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <FiMoon />
    </button>
  );
};
