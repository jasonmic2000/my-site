import type { WorkEntry } from "@/lib/content";

export interface WorkGroup {
  company: string;
  /** Earliest start across the group's roles, ISO month. */
  startDate: string;
  /** End of the newest role; absent if that role is current. */
  endDate?: string;
  /** Roles at this company, newest first. */
  entries: WorkEntry[];
}

/**
 * Groups consecutive entries at the same company so the company is shown once.
 * Expects entries sorted newest first. Non-adjacent stints at the same company
 * (a return after another job) stay separate groups.
 */
export function groupWorkEntries(entries: WorkEntry[]): WorkGroup[] {
  const groups: WorkGroup[] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last && last.company === entry.company) {
      last.entries.push(entry);
      if (entry.startDate < last.startDate) last.startDate = entry.startDate;
    } else {
      groups.push({
        company: entry.company,
        startDate: entry.startDate,
        endDate: entry.endDate,
        entries: [entry],
      });
    }
  }
  return groups;
}
