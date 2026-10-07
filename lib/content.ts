import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import html from "remark-html";
import { VFile } from "vfile";
import { matter } from "vfile-matter";

export const CONTENT_DIR = path.join(process.cwd(), "content");
const ISO_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface RawEntry {
  fileName: string;
  data: Record<string, unknown>;
  content: string;
}

/** Reads every `.mdx` file in `content/<dir>` and splits frontmatter from body. */
export function readContentDir(dir: string): RawEntry[] {
  const dirPath = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((fileName) => {
      const file = new VFile(
        fs.readFileSync(path.join(dirPath, fileName), "utf8"),
      );
      matter(file, { strip: true });
      return {
        fileName,
        data: (file.data.matter ?? {}) as Record<string, unknown>,
        content: String(file),
      };
    });
}

export function requireString(entry: RawEntry, key: string): string {
  const value = entry.data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${entry.fileName}: frontmatter "${key}" must be a string`);
  }
  return value;
}

export function requireMonth(entry: RawEntry, key: string): string {
  const value = requireString(entry, key);
  if (!ISO_MONTH.test(value)) {
    throw new Error(
      `${entry.fileName}: frontmatter "${key}" must be an ISO month (YYYY-MM), got "${value}"`,
    );
  }
  return value;
}

export interface WorkEntry {
  company: string;
  role: string;
  /** ISO month, e.g. "2022-03". */
  startDate: string;
  /** ISO month; absent for the current role. */
  endDate?: string;
  initialDetails: string;
  detailsHtml: string;
}

async function toHtml(markdown: string): Promise<string> {
  return (await remark().use(html).process(markdown)).toString();
}

export async function getAllWorkEntries(): Promise<WorkEntry[]> {
  const entries = await Promise.all(
    readContentDir("work").map(async (raw): Promise<WorkEntry> => {
      const endDate = raw.data.endDate;
      return {
        company: requireString(raw, "company"),
        role: requireString(raw, "role"),
        startDate: requireMonth(raw, "startDate"),
        endDate:
          endDate === undefined ? undefined : requireMonth(raw, "endDate"),
        initialDetails:
          typeof raw.data.initialDetails === "string"
            ? raw.data.initialDetails
            : "",
        detailsHtml: await toHtml(raw.content),
      };
    }),
  );

  // ISO months sort lexicographically.
  return entries.sort((a, b) => b.startDate.localeCompare(a.startDate));
}
