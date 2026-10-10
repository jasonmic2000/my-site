"use client";
import { useEffect, useRef, useState } from "react";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import { getEmail } from "@/lib/email";

/**
 * The address is not in the page until the visitor asks for it, so it is not
 * in the HTML that scrapers fetch. Focus moves to the revealed link so
 * keyboard and screen reader users land on it.
 */
export const RevealEmail = () => {
  const [email, setEmail] = useState<string | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (email) linkRef.current?.focus();
  }, [email]);

  if (email) {
    return (
      <a
        ref={linkRef}
        href={`mailto:${email}`}
        className={`flex gap-2 ${HOVER_TRANSITION_CLASS}`}
      >
        {email}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setEmail(getEmail())}
        className={`flex gap-2 underline underline-offset-4 ${HOVER_TRANSITION_CLASS}`}
      >
        Show email address
      </button>
      <noscript>
        My email address is hidden from bots and needs JavaScript. Please use
        one of the links above instead.
      </noscript>
    </>
  );
};
