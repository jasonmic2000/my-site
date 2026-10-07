import { buildFeed } from "@/lib/feed";

// Keep the site fully static: GET handlers are dynamic by default.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildFeed().rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
