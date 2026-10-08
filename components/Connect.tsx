import Link from "next/link";
import {
  DEFAULT_METADATA,
  HOVER_TRANSITION_CLASS,
  SITE,
  SOCIALS,
} from "@/lib/consts";

export const Connect = () => {
  return (
    <section className="space-y-6">
      <h2 className="font-semibold text-black dark:text-white">
        Let&apos;s Connect
      </h2>
      <article>
        <p className="font-serif">
          If something on this site caught your attention, or you just want to
          say hi, feel free to reach out on social media or send me an email.
        </p>
      </article>
      <ul className="mt-8 mb-2 flex flex-wrap">
        {SOCIALS.map(({ NAME, HREF, ICON }) => (
          <li
            key={NAME}
            className={`flex text-nowrap pr-2 text-xl ${HOVER_TRANSITION_CLASS}`}
          >
            <Link
              href={HREF}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${DEFAULT_METADATA.siteName} on ${NAME}`}
            >
              <ICON />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`mailto:${SITE.EMAIL}`}
        aria-label={`Email ${DEFAULT_METADATA.siteName}`}
        className={`flex gap-2 ${HOVER_TRANSITION_CLASS}`}
      >
        {SITE.EMAIL}
      </Link>
    </section>
  );
};
