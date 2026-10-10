import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import type { Heading } from "@/lib/mdx";

/** Short posts do not need one. */
export const MIN_TOC_HEADINGS = 3;

/** Collapsible "On this page" list for a post's h2/h3 headings. */
export const TableOfContents = ({ headings }: { headings: Heading[] }) => {
  if (headings.length < MIN_TOC_HEADINGS) return null;

  return (
    <details className="rounded-md border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700">
      <summary className="cursor-pointer font-medium text-black dark:text-white">
        On this page
      </summary>
      <nav aria-label="Table of contents" className="mt-3">
        <ol className="space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.depth === 3 ? "pl-4" : ""}>
              <a
                href={`#${heading.id}`}
                className={`text-zinc-600 dark:text-zinc-400 ${HOVER_TRANSITION_CLASS}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
};
