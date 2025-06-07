import { clsx, type ClassValue } from "clsx"
import fs from "fs";
import matter from "gray-matter";
import path from 'path';
import { remark } from "remark";
import html from "remark-html";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const workDir = path.join(process.cwd(), 'content', 'work');

export interface WorkEntryMeta {
  // slug: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  initialDetails: string;
  detailsHtml: string;
}

export async function getAllWorkEntries(): Promise<WorkEntryMeta[]> {
  const files = fs.readdirSync(workDir).filter((file) => file.endsWith('.mdx'));

  const entries: WorkEntryMeta[] = await Promise.all(files.map(async (fileName) => {
    const filePath = path.join(workDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const htmlDetails = await remark().use(html).process(content);

    return {
      // slug: fileName.replace(/\.mdx$/, ''),
      company: data.company,
      role: data.role,
      startDate: data.startDate,
      endDate: data.endDate,
      initialDetails: data.initialDetails,
      detailsHtml: htmlDetails.toString(),
    };
  }))

  return entries;
}
