import Link from "next/link";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
];

const NotFound = () => {
  return (
    <section className="space-y-6">
      <p aria-hidden="true" className="font-extrabold text-[2rem] text-accent">
        404
      </p>
      <h1 className="font-semibold text-black dark:text-white">
        Page not found
      </h1>
      <p className="font-serif">
        This page doesn’t exist, or it has moved. Try one of these instead:
      </p>
      <ul className="flex flex-wrap gap-4">
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`underline underline-offset-4 ${HOVER_TRANSITION_CLASS}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotFound;
