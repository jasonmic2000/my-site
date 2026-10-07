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
    <header className="mb-12 w-full py-5 lg:mb-16">
      <div className="flex flex-row items-center justify-between px-4 md:px-0">
        <div className="flex items-center">
          <h1 className="font-semibold text-md">
            <Link href="/" className={HOVER_TRANSITION_CLASS}>
              ¯\_(ツ)_/¯
            </Link>
          </h1>
        </div>
        <nav
          aria-label="Main"
          className="flex flex-row items-center gap-4 md:mt-0 md:ml-auto"
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
