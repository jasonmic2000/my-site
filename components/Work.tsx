import { WorkEntryMeta } from "@/lib/utils";
import Link from "next/link";

const Work = ({
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
          <Link href="/work" className="hover:text-black hover:dark:text-white transition duration-300 ease-in-out font-semibold font-sans text-sm">
            See all work
          </Link>
        )}
      </div>
      {workEntries.map((entry: WorkEntryMeta) => (
        <ul className="flex flex-col" key={entry.startDate}>
          <li>
            <p className="font-semibold">{entry.company}</p>
            <p className="text-sm opacity-75">{entry.role}</p>
            <span className="text-sm opacity-75">
              {`${entry.startDate} - ${entry.endDate}`}
            </span>
            <article className="pt-4 font-serif">
              {entry.initialDetails && (
                <p>{entry.initialDetails}</p>
              )}
              {showDetails && (
                <div
                  className="pt-4 pb-12 markdown-list"
                  dangerouslySetInnerHTML={{ __html: entry.detailsHtml }}
                />
              )}
            </article>
          </li>
        </ul>
      ))}
    </section>
  );
};

export default Work;
