"use client";
import Link from "next/link";
// import { useKBar } from "kbar";
import { useTheme } from "next-themes";
import { FiMoon } from "react-icons/fi";

const NavbarItems = [
  {
    name: "blog",
    slug: "/blog",
  },
  {
    name: "projects",
    slug: "/projects",
  },
  {
    name: "work",
    slug: "/work",
  }
];

const Navbar = () => {
  const { setTheme, resolvedTheme } = useTheme();
  //   const { query } = useKBar();

  return (
    // Astro Nano
    // <header>
    //   <div className="mx-auto max-w-(--breakpoint-sm) px-3">
    //     <div className="flex flex-wrap justify-between gap-y-2">
    //       <Link href="/">
    //         <div className="font-semibold">¯\_(ツ)_/¯</div>
    //       </Link>
    //       <nav className="flex items-center gap-1 text-sm">
    //         <Link href="/blog">blog</Link>
    //         <span>{`|`}</span>
    //         <Link href="/projects">projects</Link>
    //         <span>{`|`}</span>
    //         <button
    //           id="magnifying-glass"
    //           aria-label="Search"
    //           className="flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
    //         >
    //           {/* <FiSearch /> */}
    //           search
    //         </button>
    //         <span>{`|`}</span>
    //         {/* <Link href="#" onClick={() => {}}>
    //           Search
    //         </Link> */}
    //         <button
    //           id="theme-toggle"
    //           aria-label="Toggle theme"
    //           className="flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
    //           onClick={() =>
    //             setTheme(resolvedTheme === "dark" ? "light" : "dark")
    //           }
    //         >
    //           <FaCircleHalfStroke
    //             name="fa6-solid:circle-half-stroke"
    //             className="h-[14px] w-[14px] text-[#1c1c1c] dark:text-[#D4D4D4]"
    //           />
    //         </button>
    //       </nav>
    //     </div>
    //   </div>
    // </header>

    // Astrofolio
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-semibold hover:text-black dark:hover:text-white transition duration-300">
            ¯\_(ツ)_/¯
          </Link>
        </div>
        <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {NavbarItems.map((item, index) => (
            <Link
              key={index}
              href={item.slug}
              className="transition-all hover:text-black dark:hover:text-white flex align-middle relative duration-300"
            >
              {item.name}
            </Link>
          ))}
          <button
            id="theme-toggle"
            aria-label="Toggle theme"
            className="flex items-center justify-center transition duration-300 hover:text-black dark:hover:text-white"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
             <FiMoon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
