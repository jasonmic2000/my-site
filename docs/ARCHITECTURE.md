# Architecture

Stable description of how the site is built. Facts that go stale quickly
(versions, audit results) live in [TODO.md](TODO.md) under "Health snapshot".
Why things are the way they are: [DECISIONS.md](DECISIONS.md).

## Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript (strict, `@/*` → repo root)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), dark mode via `class` strategy
- **Theming**: `next-themes` (system/light/dark); toggle lives in `Navbar`
- **Content**: MDX + frontmatter, parsed with `gray-matter`, body rendered with `remark`/`remark-html`
- **Fonts**: `next/font/google` (Geist Sans/Mono) · **Icons**: `react-icons`
- **Lint/format**: Biome (`biome.json`); `npm run lint | lint:fix | format`
- **Dev/build**: `next dev --turbopack`, `next build`, `next start`
- **Deploy**: Vercel (Node 22), `@vercel/speed-insights`, domain `dev.jasonjmichael.com`
- Fully static: every route prerenders at build time.

## Routing (`app/`)
Flat, one folder per route; no dynamic routes, API routes, middleware/proxy or route groups yet.
- `layout.tsx` — root layout: fonts, global metadata (title template, OG/Twitter from `lib/consts.ts`), `Providers` (theme), `Navbar`/`Footer`, `max-w-[640px]` shell
- `page.tsx` (`/`) — bio + most recent work entry + `Connect`
- `work/page.tsx` (`/work`) — full history via `getAllWorkEntries()`
- `blog/page.tsx` (`/blog`) — placeholder ("under construction")
- Metadata file conventions: `opengraph-image.tsx`, `apple-icon.tsx` (both `ImageResponse`), `manifest.ts`, `robots.ts`, `sitemap.ts` (site URL from `DEFAULT_METADATA`)

## Components (`components/`)
Flat: `Navbar` (client; theme toggle + links), `Footer`, `Work`, `Connect`, `AnimatedArrow` (unused, intentional).

## Content layer
`content/work/*.mdx` (frontmatter: `company`, `role`, `startDate`, `endDate`, `initialDetails`) →
`lib/utils.ts#getAllWorkEntries()`: `fs` read → `gray-matter` → `remark().use(html)` → sort by `startDate` desc.
Build/server-side only, called from async Server Components. No client fetching, no external services.
`@next/mdx` is deliberately not used; the blog will use `next-mdx-remote-client` (see BLOG-PLAN.md).

## State
Only theme (`next-themes`, read via `useTheme()` in `Navbar`). No context, store or forms.

## Conventions
- `@/*` alias imports everywhere; named component exports (default only where Next requires)
- Server Components by default; `"use client"` only at leaves
- Server-only code (`fs`, `gray-matter`, `remark`) must not be imported from client components; shared constants go in `lib/consts.ts` (this once broke the build via `HOVER_TRANSITION_CLASS`)
- Shared class fragments are plain string constants (`HOVER_TRANSITION_CLASS`), no `cn()`/`clsx`
- Secondary text uses `text-zinc-600 dark:text-zinc-400` (verified ≥ 6.9:1 contrast); body palette is zinc
