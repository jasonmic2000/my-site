import type { Metadata } from "next";
import { Work } from "@/components/Work";
import { getAllWorkEntries } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Work",
  description: "My professional experience and roles.",
};

const WorkPage = async () => {
  const workEntries = await getAllWorkEntries();
  return <Work workEntries={workEntries} showDetails={true} />;
};

export default WorkPage;
