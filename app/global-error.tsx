"use client";

import "@/styles/globals.css";
import { geistMono, geistSans } from "./fonts";

// Replaces the root layout when it fails, so it needs its own <html>/<body>.
// The app theme (next-themes) isn't available here, so colours follow the
// operating system's colour scheme instead of the class-based toggle.
const GlobalError = ({ retry }: { retry: () => void }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-auto mt-2 flex w-full min-w-0 max-w-[640px] flex-col items-center justify-center bg-zinc-100 text-zinc-700 antialiased md:mt-6 [@media(prefers-color-scheme:dark)]:bg-zinc-900 [@media(prefers-color-scheme:dark)]:text-zinc-300`}
      >
        <main className="w-full max-w-2xl space-y-6 px-4 py-24">
          <p
            aria-hidden="true"
            className="font-extrabold text-(--accent-light) text-[2rem] [@media(prefers-color-scheme:dark)]:text-(--accent-dark)"
          >
            Oops
          </p>
          <h1 className="font-semibold text-black [@media(prefers-color-scheme:dark)]:text-white">
            Something went wrong
          </h1>
          <p role="alert" className="font-serif">
            The site hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-md border border-zinc-400 px-3 py-1.5 text-sm [@media(prefers-color-scheme:dark)]:border-zinc-600"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
