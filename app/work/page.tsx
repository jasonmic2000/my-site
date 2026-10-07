import type { Metadata } from "next";
import { Work } from "@/components/Work";
import { getAllWorkEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "My professional experience and roles.",
  path: "/work",
});

const WorkPage = async () => {
  const workEntries = await getAllWorkEntries();
  return <Work workEntries={workEntries} showDetails={true} headingAs="h1" />;
};

export default WorkPage;
