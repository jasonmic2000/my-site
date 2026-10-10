# Architecture

Stable description of how the site is built. Facts that go stale quickly
(versions, audit results) live in [TODO.md](TODO.md) under "Health snapshot".
Why things are the way they are: [DECISIONS.md](DECISIONS.md).

## Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript (strict, `@/*` → repo root)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), dark mode via `class` strategy
- **Theming**: `next-themes` (system/light/dark); toggle lives in `Navbar`
- **Content**: MDX + frontmatter, parsed with `vfile-matter`, body rendered with `remark`/`remark-html`
- **Fonts**: `next/font/google` (Geist Sans/Mono) · **Icons**: `react-icons`
- **Lint/format**: Biome (`biome.json`: recommended + `next`/`react` domains, `useSortedClasses`, unused imports/variables as errors); `npm run lint | lint:fix | format`; CI in `.github/workflows/ci.yml`
- **Dev/build**: `next dev --turbopack`, `next build`, `next start`
- **Deploy**: Vercel (Node 24), `@vercel/speed-insights`, domain `dev.jasonjmichael.com`
- Fully static: every route prerenders at build time.

## Routing (`app/`)
Flat, one folder per route; no dynamic routes, API routes, middleware/proxy or route groups yet.
- `layout.tsx` — root layout: fonts, global metadata (title template, OG/Twitter from `lib/consts.ts`), `Providers` (theme), `Navbar`/`Footer`, `max-w-[640px]` shell
- `page.tsx` (`/`) — bio + most recent work entry + `Posts` (the 2 newest, `HOME_POST_COUNT`; hidden when there are none) + `Connect`
- `work/page.tsx` (`/work`) — full history via `getAllWorkEntries()`
- `blog/page.tsx` (`/blog`) — post listing; `blog/[slug]/page.tsx` — statically generated posts (`dynamicParams = false`)
- `feed.xml`, `atom.xml`, `feed.json` — static Route Handlers (`force-static`) built from `lib/feed.ts`
- Per-page metadata goes through `lib/metadata.ts#pageMetadata` (canonical + OG/Twitter incl. image; page-level `openGraph` replaces the root one, so it must repeat shared fields)
- `not-found.tsx`, `error.tsx` (client; uses the `retry` prop, stable since Next 16.3) and `global-error.tsx` (replaces the root layout, so it re-imports global CSS/fonts from `fonts.ts` and follows the OS colour scheme instead of the class-based theme) all match the site design
- Structured data: `components/JsonLd.tsx` renders JSON-LD (escapes `<`); `lib/jsonld.ts` builds `WebSite` + `Person` (home) and `BlogPosting` (posts) from site constants
- Metadata file conventions: `opengraph-image.tsx`, `apple-icon.tsx` (both `ImageResponse`), `manifest.ts`, `robots.ts`, `sitemap.ts` (site URL from `DEFAULT_METADATA`)

## Components (`components/`)
**Command menu** (`CommandMenu` trigger + `CommandMenuDialog`): opens with Ctrl/Cmd+K (or `/` when not typing in a field) from a navbar keycap
(`Ctrl K` on Windows/Linux, `⌘ K` on Mac/iOS via `useSyncExternalStore`, fixed width so there is no shift; a search icon below `sm`). It is a native
`<dialog>` opened with `showModal()` (focus trap, Esc, focus restore), with the ARIA combobox/listbox pattern (`aria-activedescendant`, live result
count). The dialog is a separate lazy chunk (about 3KB gzipped) that loads on first open or on hover/focus of the trigger; posts come from the static
`/search-index.json` route (`lib/search-index.ts`) fetched on first open, so ordinary pages carry no search data. Posts are capped (5 with no query, top 8 when typing). The search field has no focus ring (background shade and accent divider instead). The contact address is never in the HTML or JS: `lib/email.ts` holds it base64-encoded, and `components/RevealEmail.tsx` (Connect) decodes it only when the visitor clicks "Show email address". Results: Pages, Posts, Actions
(toggle theme, copy email, open RSS) and Links (GitHub, LinkedIn, X). To add an item, add it to `items` in `CommandMenuDialog.tsx`.
`PostList` (title, date, description) is shared by `/blog` and the home `Posts` section.
Flat: `Navbar` (server) composed of `NavLink` (client, `aria-current` via `usePathname`) and `ThemeToggle` (client; moon/sun both rendered and swapped with CSS `dark:` variants so there is no hydration mismatch, the accessible name describes the action and flips the same way, and the turn/scale transition inherits the global reduced-motion rule); `Footer`, `Work`, `Connect`, `AnimatedArrow` (unused, intentional).

## Content layer
`content/work/*.mdx` (frontmatter: `company`, `role`, `startDate` and optional `endDate` as ISO `YYYY-MM`,
`initialDetails`, optional `shortCompany` and `internalTitle`) → `lib/content.ts#getAllWorkEntries()`: `fs` read → `vfile-matter` (frontmatter) → validated (throws at build
on bad frontmatter) → `remark().use(html)` → sort by `startDate` desc. Omit `endDate` for the current role.
`lib/work.ts#groupWorkEntries` groups *consecutive* entries at the same company so `Work` shows the company once with its span and each role beneath (a single role keeps the compact layout; the home page shows only the newest entry).
`lib/dates.ts#formatMonth` renders ISO months for display.
Build/server-side only, called from async Server Components. No client fetching, no external services.
`@next/mdx` is deliberately not used; the blog will use `next-mdx-remote-client` (see BLOG-PLAN.md).

## Blog
`content/blog/<slug>.mdx`; slug = filename. Frontmatter: `title`, `date` (ISO), `description`, optional `tags`, `draft`.
`lib/blog.ts` validates and sorts; **drafts show in `next dev` only** (excluded from listing, post routes, sitemap and feeds in
production). Posts compile with `next-mdx-remote-client`'s `evaluate` (RSC) using `lib/mdx.ts` (remark-gfm, smartypants,
rehype-slug → autolink-headings, rehype-pretty-code/shiki dual theme; imports disabled; MDX errors fail the build).
Embeddable components and link handling live in `components/mdx-components.tsx` (`Callout`, `a` → `next/link`/external-safe).
Body styles are the `.post` block in `styles/globals.css`. Feeds carry excerpt + link. `@vercel/analytics` is in the root layout.

## Testing
`e2e/site.spec.ts` (Playwright + `@axe-core/playwright`, config in `playwright.config.ts`) runs against the production build
(`next start`, port 3100): axe WCAG 2.0/2.1/2.2 A+AA on every route, a blog post and the 404, in light *and* dark; exactly one `<h1>` per
page; skip link, theme toggle and `aria-current`; security headers; feeds/sitemap/robots; JSON-LD. Post tests find the first post
from `/blog`, so they don't depend on a slug. CI runs it after the build. No unit tests yet.

## State
Only theme (`next-themes`, read via `useTheme()` in `Navbar`). No context, store or forms.

## Conventions
- `@/*` alias imports everywhere; named component exports (default only where Next requires)
- Server Components by default; `"use client"` only at leaves
- Server-only code (`fs`, `vfile-matter`, `remark`) must not be imported from client components; shared constants go in `lib/consts.ts` (this once broke the build via `HOVER_TRANSITION_CLASS`)
- Shared class fragments are plain string constants (`HOVER_TRANSITION_CLASS`), no `cn()`/`clsx`
- Accessibility baseline: skip-to-content link (targets `#main-content`), global `:focus-visible` outline (rose), and one shared `prefers-reduced-motion` rule in `globals.css` that new animations inherit
- Secondary text uses `text-zinc-600 dark:text-zinc-400` (verified ≥ 6.9:1 contrast); body palette is zinc
- Each page owns its single `<h1>` (home: name; `/work` and `/blog`: section title; posts: post title). The `Navbar` logo is a plain link. `Work` takes `headingAs` for this.
