import Link from "next/link";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

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
        <nav
          aria-label="Main"
          className="flex flex-row gap-4 md:mt-0 md:ml-auto items-center"
        >
          {NavbarItems.map((item) => (
            <NavLink key={item.slug} href={item.slug}>
              {item.name}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
