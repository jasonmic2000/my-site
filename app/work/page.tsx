import Work from "@/components/Work";
import { getAllWorkEntries } from "@/lib/utils";

const WorkPage = async () => {
  const workEntries = await getAllWorkEntries();
  return (
    <>
      <Work workEntries={workEntries} showDetails={true} />
    </>
  );
};

export default WorkPage;
