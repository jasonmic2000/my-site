"use client";
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

const Navbar = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <header className="w-full lg:mb-16 mb-12 py-5">
      <div className="flex px-4 md:px-0 flex-row items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-md font-semibold hover:text-black dark:hover:text-white transition duration-300 ease-in-out"
          >
            ¯\_(ツ)_/¯
          </Link>
        </div>
        <div className="flex flex-row gap-4 md:mt-0 md:ml-auto items-center">
          {NavbarItems.map((item, index) => (
            <Link
              key={index}
              href={item.slug}
              className="transition-all hover:text-black dark:hover:text-white flex align-middle relative duration-300 ease-in-out"
            >
              {item.name}
            </Link>
          ))}
          <button
            id="theme-toggle"
            aria-label="Toggle theme"
            className="flex items-center justify-center transition duration-300 ease-in-out hover:text-black dark:hover:text-white"
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

export default Navbar;
