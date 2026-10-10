import Link from "next/link";
import { EmailButton } from "@/components/EmailButton";
import {
  DEFAULT_METADATA,
  HOVER_TRANSITION_CLASS,
  ICON_PRESS_CLASS,
  SOCIALS,
} from "@/lib/consts";

export const Connect = () => {
  return (
    <section className="space-y-6">
      <h2 className="font-semibold text-black dark:text-white">
        Let’s Connect
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
              className={ICON_PRESS_CLASS}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${DEFAULT_METADATA.siteName} on ${NAME}`}
            >
              <ICON />
            </Link>
          </li>
        ))}
        <EmailButton />
      </ul>
      <noscript>
        My email address needs JavaScript to appear. Please use one of the links
        above instead.
      </noscript>
    </section>
  );
};
