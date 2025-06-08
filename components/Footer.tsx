import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full py-5 pb-10 text-sm">
      <div className="mx-auto max-w-screen-sm px-4">
        © 2025 | <Link href="https://github.com/jasonmic2000" className="hover:text-black dark:hover:text-white transition duration-300 ease-in-out hover:underline">Jason Michael </Link>
      </div>
    </footer>
  );
};
