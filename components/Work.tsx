import Link from "next/link";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import type { WorkEntry } from "@/lib/content";
import { formatMonth } from "@/lib/dates";
import { groupWorkEntries } from "@/lib/work";

const MUTED = "text-sm text-zinc-600 dark:text-zinc-400";

const dateRange = (startDate: string, endDate?: string) =>
  `${formatMonth(startDate)} - ${endDate ? formatMonth(endDate) : "Current"}`;

const EntryDetails = ({
  entry,
  showDetails,
}: {
  entry: WorkEntry;
  showDetails: boolean;
}) => (
  <article className="pt-4 font-serif">
    {entry.initialDetails && <p>{entry.initialDetails}</p>}
    {showDetails && (
      <div
        className="markdown-list pt-4 pb-12"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: detailsHtml is generated at build time from self-authored MDX in content/work/, not user input.
        dangerouslySetInnerHTML={{ __html: entry.detailsHtml }}
      />
    )}
  </article>
);

export const Work = ({
  workEntries,
  showDetails = false,
  headingAs: Heading = "h2",
}: {
  workEntries: WorkEntry[];
  showDetails: boolean;
  /** Use "h1" when this section is the page's primary heading. */
  headingAs?: "h1" | "h2";
}) => {
  const groups = groupWorkEntries(workEntries);

  return (
    <section className="space-y-6">
      <div className="flex flex-row justify-between">
        <Heading className="font-semibold text-black dark:text-white">
          Work
        </Heading>
        {!showDetails && (
          <Link
            href="/work"
            className={`font-sans font-semibold text-sm ${HOVER_TRANSITION_CLASS}`}
          >
            See all work
          </Link>
        )}
      </div>
      <ul className="flex flex-col">
        {groups.map((group) => {
          const [only, ...rest] = group.entries;
          const key = `${group.company}-${group.startDate}`;

          // A single role keeps the compact layout.
          if (only && rest.length === 0) {
            return (
              <li key={key}>
                <p className="font-semibold">{only.company}</p>
                <p className={MUTED}>{only.role}</p>
                {only.internalTitle && (
                  <p className={`${MUTED} italic`}>
                    Internal title: {only.internalTitle}
                  </p>
                )}
                <span className={MUTED}>
                  {dateRange(only.startDate, only.endDate)}
                </span>
                <EntryDetails entry={only} showDetails={showDetails} />
              </li>
            );
          }

          // Several roles at one company: show the company once with its span.
          return (
            <li key={key}>
              <p className="font-semibold">{group.company}</p>
              <span className={MUTED}>
                {dateRange(group.startDate, group.endDate)}
              </span>
              {/* The rail hangs in the left gutter (md+) so role text stays on the content's left edge; 2px border + 14px padding = the 16px it is pulled out by. No rail on small screens, where there is no gutter. */}
              <ul className="mt-4 flex flex-col gap-8 md:-ml-4 md:border-zinc-300 md:border-l-2 md:pl-3.5 dark:md:border-zinc-700">
                {group.entries.map((entry) => (
                  <li key={entry.startDate}>
                    <p className="font-medium text-black dark:text-white">
                      {entry.role}
                    </p>
                    {entry.internalTitle && (
                      <p className={`${MUTED} italic`}>
                        Internal title: {entry.internalTitle}
                      </p>
                    )}
                    <span className={MUTED}>
                      {dateRange(entry.startDate, entry.endDate)}
                    </span>
                    <EntryDetails entry={entry} showDetails={showDetails} />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
