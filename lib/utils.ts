import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const workDir = path.join(process.cwd(), "content", "work");

export interface WorkEntryMeta {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  initialDetails: string;
  detailsHtml: string;
}

export async function getAllWorkEntries() {
  const files = fs.readdirSync(workDir).filter((file) => file.endsWith(".mdx"));

  const entries: WorkEntryMeta[] = await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(workDir, fileName);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      const htmlDetails = await remark().use(html).process(content);

      return {
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate,
        initialDetails: data.initialDetails,
        detailsHtml: htmlDetails.toString(),
      };
    }),
  );

  return entries.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}
