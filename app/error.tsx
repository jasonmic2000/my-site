"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

const ErrorPage = ({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="space-y-6">
      <p
        aria-hidden="true"
        className="font-extrabold text-[2rem] text-rose-600 dark:text-rose-400"
      >
        Oops
      </p>
      <h1 className="font-semibold text-black dark:text-white">
        Something went wrong
      </h1>
      <p role="alert" className="font-serif">
        An unexpected error occurred while loading this page. You can try again,
        or head back home.
      </p>
      {error.digest && (
        <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
          Reference: {error.digest}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => retry()}
          className={`rounded-md border border-zinc-400 px-3 py-1.5 text-sm dark:border-zinc-600 ${HOVER_TRANSITION_CLASS}`}
        >
          Try again
        </button>
        <Link
          href="/"
          className={`underline underline-offset-4 ${HOVER_TRANSITION_CLASS}`}
        >
          Back to home
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
