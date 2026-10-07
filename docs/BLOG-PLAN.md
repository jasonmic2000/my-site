# Blog plan (planning stage, not built)

Posts will embed **live React components** (demos, callouts), so the pipeline
needs real MDX (JSX in markdown), not just markdown → HTML.

## Architecture: `next-mdx-remote-client`
Same `@mdx-js/mdx` engine as `@next/mdx`, but `compileMDX()` is a plain function
you call on a content string — same shape as today's `getAllWorkEntries()`
(`fs` → read → frontmatter → *transform content*). The migration is swapping
`remark().use(html)` for `compileMDX()`. It runs once per post at build time via
`generateStaticParams()`, so the site stays fully static.

Rejected: plain remark→rehype (can't embed components); `@next/mdx` (file-based
page model fits `/blog/[slug]` poorly; would need per-post page files or dynamic
`import()`). Accepted tradeoff: community fork, small ecosystem-lag risk.

`@next/mdx` is currently configured but unused (see TODO P2); the work pipeline
never invokes it.

## Packages
| Package | Role |
|---|---|
| `next-mdx-remote-client` | MDX compile; has a built-in `parseFrontmatter` option, which would let us drop `gray-matter` (and its audit chain) |
| `remark-gfm`, `remark-smartypants` | remark stage: tables/task lists; smart quotes |
| `rehype-slug` → `rehype-autolink-headings` | rehype stage; **order matters** (slug first) |
| `shiki` + `rehype-pretty-code` | syntax highlighting, dual light/dark theme |
| `@vercel/analytics` | pageviews (separate from Speed Insights) |
| `feed` (optional) | RSS/Atom/JSON Feed; could be hand-rolled to avoid a dependency |

Feeds need custom Route Handlers (no `MetadataRoute` convention) returning the
right `Content-Type` (`application/rss+xml`, `application/atom+xml`, `application/feed+json`).

## Open decisions (recommended defaults)
- [ ] Slug: **filename** (vs frontmatter `slug`)
- [ ] Frontmatter: `title`, `date` (ISO), `description`, `draft`, optional `tags`
- [ ] Drafts: **shown in dev only**; filtered from listing, feed and sitemap in production
- [ ] Feed content: **excerpt + link** in v1
- [ ] MDX `components` map (e.g. `<Callout>`, `<a>` → `next/link`): yes, one central file
- [ ] Shared `getContentEntries(dir)` helper for `/work` and `/blog` (build first)
- [ ] `sitemap.ts`: generate per-post entries
- [ ] Defer to v2: per-post OG images, reading time, table of contents
