"use client"
import {
  FiHome,
  FiPaperclip,
  FiUser,
  FiSun,
//   FiMoon,
  FiZap,
  FiCommand,
} from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";
// import { useKBar } from "kbar";
// import { useTheme } from "next-themes";

const NavbarItems = [
  {
    name: "Home",
    slug: "/",
    icon: FiHome,
  },
  {
    name: "About",
    slug: "/about",
    icon: FiUser,
  },
  {
    name: "Links",
    slug: "/links",
    icon: FiPaperclip,
  },
  {
    name: "Dashboard",
    slug: "/dashboard",
    icon: FiZap,
  },
];

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
//   const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
//   const { query } = useKBar();
  const [tooltipVisibility, setTooltipVisibility] = useState([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-full min-h-full w-full flex-col items-center justify-start pt-6">
      <div className="flex flex-row gap-12">
        {NavbarItems.map((item, index) => {
          return (
            <div key={item.slug}>
              {path === item.slug ? (
                <button
                  key={index}
                  className="relative flex w-full items-center justify-center rounded bg-zinc-800 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl focus:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
                  onClick={() => router.push(item.slug)}
                  onMouseLeave={() => {
                    const temp = [...tooltipVisibility];
                    temp[index] = false;
                    setTooltipVisibility(temp);
                  }}
                  onMouseEnter={() => {
                    const temp = [...tooltipVisibility];
                    temp[index] = true;
                    setTooltipVisibility(temp);
                  }}
                >
                  <div className="p-2">
                    <item.icon size="1rem" className="text-zinc-100" />
                  </div>
                  {tooltipVisibility[index] && (
                    <span className="absolute top-11 min-w-full rounded bg-zinc-800 p-[0.62rem] text-[0.75rem] leading-none text-zinc-200 shadow-xl dark:bg-zinc-700">
                      {item.name}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  key={index}
                  className="relative flex w-full items-center justify-center rounded bg-zinc-700 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl focus:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
                  onClick={() => router.push(item.slug)}
                  onMouseLeave={() => {
                    const temp = [...tooltipVisibility];
                    temp[index] = false;
                    setTooltipVisibility(temp);
                  }}
                  onMouseEnter={() => {
                    const temp = [...tooltipVisibility];
                    temp[index] = true;
                    setTooltipVisibility(temp);
                  }}
                >
                  <div className="p-2">
                    <item.icon size="1rem" className="text-zinc-100" />
                  </div>
                  {tooltipVisibility[index] && (
                    <span className="absolute top-11 min-w-full rounded bg-zinc-800 p-[0.62rem] text-[0.75rem] leading-none text-zinc-200 shadow-xl dark:bg-zinc-700">
                      {item.name}
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        })}
        <div className="flex flex-row gap-12">
          {mounted === true && (
            <button
              className="flex w-full items-center justify-center rounded bg-zinc-700 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-800 dark:hover:bg-zinc-700"
            //   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <div className="p-2 text-zinc-100">
                {/* {theme === "dark" ? <FiSun /> : <FiMoon />} */}
                <FiSun />
              </div>
            </button>
          )}
          <button
            className="flex w-full items-center justify-center rounded bg-zinc-700 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-800 dark:hover:bg-zinc-700"
            // onClick={query.toggle}
          >
            <div className="p-2">
              <FiCommand size="1rem" className="text-zinc-100" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
