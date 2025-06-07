import { WorkEntryMeta } from "@/lib/utils";

const Work = ({
  workEntries,
  showDetails = false,
}: {
  workEntries: WorkEntryMeta[];
  showDetails?: boolean;
}) => {
  return (
    <div>
      <h2 className="font-semibold">Work</h2>
      {workEntries.map((entry: WorkEntryMeta) => (
        <ul className="flex flex-col py-4" key={entry.startDate}>
          <li className="animate">
            <div className="font-semibold">{entry.company}</div>
            <div className="text-sm opacity-75">{entry.role}</div>
            <div className="text-sm opacity-75">
              {`${entry.startDate} - ${entry.endDate}`}
            </div>
            <article>
              <div className="py-4 font-serif">{entry.initialDetails}</div>
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
