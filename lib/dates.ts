/** Formats an ISO year-month ("2022-03") as "March 2022". */
export function formatMonth(isoMonth: string): string {
  return new Date(`${isoMonth}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Formats an ISO date ("2026-10-07") as "October 7, 2026". */
export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
