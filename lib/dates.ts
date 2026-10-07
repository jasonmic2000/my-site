/** Formats an ISO year-month ("2022-03") as "March 2022". */
export function formatMonth(isoMonth: string): string {
  return new Date(`${isoMonth}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
