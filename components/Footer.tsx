import Link from "next/link";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

export const Footer = () => {
  return (
    <footer className="w-full py-5 pb-10 text-sm">
      <div className="mx-auto max-w-screen-sm px-4">
        © 2025 |{" "}
        <Link
          href="https://github.com/jasonmic2000"
          className={`${HOVER_TRANSITION_CLASS} hover:underline`}
        >
          Jason Michael{" "}
        </Link>
      </div>
    </footer>
  );
};
