import { WorkEntryMeta } from "@/lib/utils";

const Work = ({
  workEntries,
  showDetails = false,
}: {
  workEntries: WorkEntryMeta[];
  showDetails: boolean;
}) => {
  return (
    <div>
      <div className="flex flex-row justify-between mb-4">
        <h2 className="font-semibold text-black dark:text-white">Work</h2>
        {!showDetails && (
          <span className="font-semibold font-sans text-sm">See all work</span>
        )}
      </div>
      {workEntries.map((entry: WorkEntryMeta) => (
        <ul className="flex flex-col py-4" key={entry.startDate}>
          <li className="animate">
            <p className="font-semibold">{entry.company}</p>
            <p className="text-sm opacity-75">{entry.role}</p>
            <span className="text-sm opacity-75">
              {`${entry.startDate} - ${entry.endDate}`}
            </span>
            <article>
              {entry.initialDetails && (
                <p className="py-4 font-serif">{entry.initialDetails}</p>
              )}
              {showDetails && (
                <div
                  className="font-serif list-circle"
                  dangerouslySetInnerHTML={{ __html: entry.detailsHtml }}
                />
              )}
            </article>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default Work;
