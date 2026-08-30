import Link from "next/link";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import type { WorkEntryMeta } from "@/lib/utils";

export const Work = ({
  workEntries,
  showDetails = false,
}: {
  workEntries: WorkEntryMeta[];
  showDetails: boolean;
}) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-row justify-between">
        <h2 className="font-semibold text-black dark:text-white">Work</h2>
        {!showDetails && (
          <Link
            href="/work"
            className={`font-semibold font-sans text-sm ${HOVER_TRANSITION_CLASS}`}
          >
            See all work
          </Link>
        )}
      </div>
      <ul className="flex flex-col">
        {workEntries.map((entry: WorkEntryMeta) => (
          <li key={entry.startDate}>
            <p className="font-semibold">{entry.company}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {entry.role}
            </p>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {`${entry.startDate} - ${entry.endDate}`}
            </span>
            <article className="pt-4 font-serif">
              {entry.initialDetails && <p>{entry.initialDetails}</p>}
              {showDetails && (
                <div
                  className="pt-4 pb-12 markdown-list"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: detailsHtml is generated at build time from self-authored MDX in content/work/, not user input.
                  dangerouslySetInnerHTML={{ __html: entry.detailsHtml }}
                />
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
