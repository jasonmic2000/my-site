import Link from "next/link";
import { HOVER_TRANSITION_CLASS, SITE, SOCIALS } from "@/lib/consts";

export const Connect = () => {
  return (
    <section className="space-y-6">
      <h2 className="font-semibold text-black dark:text-white">
        Let&apos;s Connect
      </h2>
      <article>
        <p className="font-serif">
          If you want to get in touch with me about something or just to say hi,
          reach out on social media or send me an email.
        </p>
      </article>
      <ul className="flex flex-wrap mb-2 mt-8">
        {SOCIALS.map(({ NAME, HREF, ICON }) => (
          <li
            key={NAME}
            className={`flex text-xl pr-2 text-nowrap ${HOVER_TRANSITION_CLASS}`}
          >
            <Link
              href={HREF}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${SITE.NAME} on ${NAME}`}
            >
              <ICON />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`mailto:${SITE.EMAIL}`}
        aria-label={`Email ${SITE.NAME}`}
        className={`flex gap-2 ${HOVER_TRANSITION_CLASS}`}
      >
        {SITE.EMAIL}
      </Link>
    </section>
  );
};
