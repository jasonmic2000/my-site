"use client";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FiMoon } from "react-icons/fi";

const NavbarItems = [
  {
    name: "blog",
    slug: "/blog",
  },
  {
    name: "work",
    slug: "/work",
  },
];

export const Navbar = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <header className="w-full lg:mb-16 mb-12 py-5">
      <div className="flex px-4 md:px-0 flex-row items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-md font-semibold">
            <Link href="/" className={HOVER_TRANSITION_CLASS}>
              ¯\_(ツ)_/¯
            </Link>
          </h1>
        </div>
        <div className="flex flex-row gap-4 md:mt-0 md:ml-auto items-center">
          {NavbarItems.map((item, index) => (
            <Link
              key={index}
              href={item.slug}
              className={`flex align-middle relative ${HOVER_TRANSITION_CLASS}`}
            >
              {item.name}
            </Link>
          ))}
          <button
            id="theme-toggle"
            aria-label="Toggle theme"
            className={`flex items-center justify-center ${HOVER_TRANSITION_CLASS}`}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <FiMoon />
          </button>
        </div>
      </div>
    </header>
  );
};
