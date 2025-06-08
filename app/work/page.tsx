import Work from "@/components/Work";
import { getAllWorkEntries } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "My professional experience and roles.",
};

const WorkPage = async () => {
  const workEntries = await getAllWorkEntries();
  return <Work workEntries={workEntries} showDetails={true} />;
};

export default WorkPage;
