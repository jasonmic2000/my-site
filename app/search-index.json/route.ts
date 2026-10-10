import { getSearchIndex } from "@/lib/search-index";

// Keep the site fully static: GET handlers are dynamic by default.
export const dynamic = "force-static";

export function GET() {
  return Response.json(getSearchIndex());
}
