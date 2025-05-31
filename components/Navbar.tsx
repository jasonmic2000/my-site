"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiCommand,
  FiHome,
  FiMoon,
  FiPaperclip,
  FiSun,
  FiUser,
  //   FiMoon,
  FiZap,
  FiSearch,
} from "react-icons/fi";
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
    // <div className="flex h-full min-h-full w-full flex-col items-center justify-start pt-6">
    //   <div className="flex flex-row gap-12">
    //     {NavbarItems.map((item, index) => {
    //       return (
    //         <div key={item.slug}>
    //           {path === item.slug ? (
    //             <Button
    //               key={index}
    //               className="relative flex w-full items-center justify-center rounded bg-zinc-800 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl focus:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
    //               onClick={() => router.push(item.slug)}
    //               onMouseLeave={() => {
    //                 const temp = [...tooltipVisibility];
    //                 temp[index] = false;
    //                 setTooltipVisibility(temp);
    //               }}
    //               onMouseEnter={() => {
    //                 const temp = [...tooltipVisibility];
    //                 temp[index] = true;
    //                 setTooltipVisibility(temp);
    //               }}
    //             >
    //               <div className="p-2">
    //                 <item.icon size="1rem" className="text-zinc-100" />
    //               </div>
    //               {tooltipVisibility[index] && (
    //                 <span className="absolute top-11 min-w-full rounded bg-zinc-800 p-[0.62rem] text-[0.75rem] leading-none text-zinc-200 shadow-xl dark:bg-zinc-700">
    //                   {item.name}
    //                 </span>
    //               )}
    //             </Button>
    //           ) : (
    //             <Button
    //               key={index}
    //               className="relative flex w-full items-center justify-center rounded bg-zinc-700 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl focus:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
    //               onClick={() => router.push(item.slug)}
    //               onMouseLeave={() => {
    //                 const temp = [...tooltipVisibility];
    //                 temp[index] = false;
    //                 setTooltipVisibility(temp);
    //               }}
    //               onMouseEnter={() => {
    //                 const temp = [...tooltipVisibility];
    //                 temp[index] = true;
    //                 setTooltipVisibility(temp);
    //               }}
    //             >
    //               <div className="p-2">
    //                 <item.icon size="1rem" className="text-zinc-100" />
    //               </div>
    //               {tooltipVisibility[index] && (
    //                 <span className="absolute top-11 min-w-full rounded bg-zinc-800 p-[0.62rem] text-[0.75rem] leading-none text-zinc-200 shadow-xl dark:bg-zinc-700">
    //                   {item.name}
    //                 </span>
    //               )}
    //             </Button>
    //           )}
    //         </div>
    //       );
    //     })}
    //     <div className="flex flex-row gap-12">
    //       {mounted === true && (
    //         <Button
    //           className="flex items-center justify-center rounded bg-zinc-700 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-800 dark:hover:bg-zinc-700"
    //           //   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    //         >
    //           <div className="p-2 text-zinc-100">
    //             {/* {theme === "dark" ? <FiSun /> : <FiMoon />} */}
    //             <FiSun />
    //           </div>
    //         </Button>
    //       )}
    //       <Button
    //         className="flex items-center justify-center rounded bg-zinc-700 py-1 px-4 shadow duration-300 ease-in-out hover:scale-110 hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-800 dark:hover:bg-zinc-700"
    //         // onClick={query.toggle}
    //       >
    //         <div className="p-2">
    //           Hello there!
    //           <FiCommand size="1rem" className="text-zinc-100" />
    //         </div>
    //       </Button>
    //     </div>
    //   </div>
    // </div>

    // Astro Nano
    <header>
      <div className="mx-auto max-w-(--breakpoint-sm) px-3">
        <div className="flex flex-wrap justify-between gap-y-2">
          <Link href="/">
            <div className="font-semibold">Jason Michael&nbsp;🔬</div>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/blog">blog</Link>
            <span>{`/`}</span>
            <Link href="/projects">projects</Link>
            <span>{`/`}</span>
            <button
              id="magnifying-glass"
              aria-label="Search"
              className="flex items-center rounded-sm border border-black/15 bg-neutral-100 px-2 py-1 text-xs transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black focus-visible:bg-black/5 focus-visible:text-black dark:border-white/20 dark:bg-neutral-900 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:bg-white/5 dark:focus-visible:text-white"
            >
              <FiSearch />
              &nbsp;Search
            </button>
            {/* <Link href="#" onClick={() => {}}>
              Search
            </Link> */}
          </nav>
        </div>
      </div>
    </header>

    // Astrofolio
    // <nav className="lg:mb-16 mb-12 py-5">
    //   <div className="flex flex-col md:flex-row md:items-center justify-between">
    //     <div className="flex items-center">
    //       <Link href="/" className="text-3xl font-semibold">
    //         Jason Michael
    //       </Link>
    //     </div>
    //     <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
    //       {NavbarItems.map((item, index) => (
    //         <Link
    //           key={index}
    //           href={item.slug}
    //           className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative"
    //         >
    //           {item.name}
    //         </Link>
    //       ))}
    //       <button
    //         id="theme-toggle"
    //         aria-label="Toggle theme"
    //         className="flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
    //       >
    //         <FiMoon
    //           name="fa6-solid:circle-half-stroke"
    //           className="h-[14px] w-[14px] text-[#1c1c1c] dark:text-[#D4D4D4]"
    //         />
    //       </button>
    //     </div>
    //   </div>
    // </nav>
  );
};

export default Navbar;
