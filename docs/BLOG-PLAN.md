# Blog plan — implemented

The v1 blog is built; see `docs/ARCHITECTURE.md` (Blog section) for how it works. This file keeps the rationale and the
v2 backlog.


Posts will embed **live React components** (demos, callouts), so the pipeline
needs real MDX (JSX in markdown), not just markdown → HTML.

## Architecture: `next-mdx-remote-client`
Same `@mdx-js/mdx` engine as `@next/mdx`, but `evaluate()` (RSC entry) is a plain function
you call on a content string — same shape as today's `getAllWorkEntries()`
(`fs` → read → frontmatter → *transform content*). The migration is swapping
`remark().use(html)` for `evaluate()`. It runs once per post at build time via
`generateStaticParams()`, so the site stays fully static.

Rejected: plain remark→rehype (can't embed components); `@next/mdx` (file-based
page model fits `/blog/[slug]` poorly; would need per-post page files or dynamic
`import()`). Accepted tradeoff: community fork, small ecosystem-lag risk.

`@next/mdx` was removed (it was configured but unused); the work pipeline
never invokes it.

## Packages
| Package | Role |
|---|---|
| `next-mdx-remote-client` | MDX compile (`evaluate` from `/rsc`); frontmatter is parsed beforehand by `vfile-matter` (which replaced `gray-matter`) so listings don't compile MDX |
| `remark-gfm`, `remark-smartypants` | remark stage: tables/task lists; smart quotes |
| `rehype-slug` → `rehype-autolink-headings` | rehype stage; **order matters** (slug first) |
| `shiki` + `rehype-pretty-code` | syntax highlighting, dual light/dark theme |
| `@vercel/analytics` | pageviews (separate from Speed Insights) |
| `feed` (optional) | RSS/Atom/JSON Feed; could be hand-rolled to avoid a dependency |

Feeds need custom Route Handlers (no `MetadataRoute` convention) returning the
right `Content-Type` (`application/rss+xml`, `application/atom+xml`, `application/feed+json`).

## Decisions (made)
- Slug = filename; frontmatter `title`, `date` (ISO), `description`, optional `tags`, `draft`
- Drafts show in dev only; excluded from listing, post routes, feeds and sitemap in production
- Feeds (RSS 2.0, Atom, JSON Feed via the `feed` package) carry excerpt + link; `updated` pinned to the newest post date
- One central MDX components map; shared `readContentDir` + validators in `lib/content.ts` serve `/work` and `/blog`
- `sitemap.ts` generates per-post entries; `@vercel/analytics` added

## v2 backlog
- Per-post OG images (`app/blog/[slug]/opengraph-image.tsx`, reuse the `ImageResponse` pattern)
- Reading time, table of contents (heading ids already exist via `rehype-slug`)
- Tag pages, full-content feeds, a real first post (`hello-world.mdx` is a draft that exercises the pipeline)
