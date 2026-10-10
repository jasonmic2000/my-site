"use client";
import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import { getEmail } from "@/lib/email";

interface Revealed {
  email: string;
  copied: boolean;
}

/**
 * The envelope in the contact icon row (render it inside the `<ul>`).
 * The address is not in the page until the visitor clicks: it is decoded,
 * copied to the clipboard, and shown as a mailto link underneath, so visitors
 * without a mail app still get it and scrapers never see it.
 */
export const EmailButton = () => {
  const [revealed, setRevealed] = useState<Revealed | null>(null);
  // Set after hydration so tests (and impatient clicks) can tell handlers are live.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const reveal = async () => {
    const email = getEmail();
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      // Clipboard blocked: the address is still shown below.
    }
    setRevealed({ email, copied });
  };

  return (
    <>
      <li className={`flex text-nowrap pr-2 text-xl ${HOVER_TRANSITION_CLASS}`}>
        <button
          type="button"
          onClick={reveal}
          aria-label="Copy email address"
          title="Copy email address"
          data-ready={ready ? "true" : undefined}
          className="flex"
        >
          <FaEnvelope aria-hidden="true" />
        </button>
        {/* Rendered empty first so screen readers announce it when it fills. */}
        <output className="sr-only">
          {revealed
            ? revealed.copied
              ? "Email address copied to clipboard"
              : "Could not copy automatically. The address is shown below."
            : ""}
        </output>
      </li>
      {revealed && (
        <li className="basis-full pt-4 text-base">
          {revealed.copied
            ? "Copied to clipboard: "
            : "Could not copy automatically: "}
          <a
            href={`mailto:${revealed.email}`}
            className={`underline underline-offset-4 ${HOVER_TRANSITION_CLASS}`}
          >
            {revealed.email}
          </a>
        </li>
      )}
    </>
  );
};
