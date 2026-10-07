"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

export const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex align-middle ${HOVER_TRANSITION_CLASS} ${isActive ? "text-black dark:text-white" : ""}`}
    >
      {children}
    </Link>
  );
};
