# Open items & health snapshot

Only unfinished work lives here; finished work is in `git log`. Priorities from
the 2026-10-07 architecture review. Check items off (or delete them) as they land.

## Health snapshot (last verified 2026-10-07)
Re-verify with: `npm outdated`, `npm audit`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- Lint, typecheck, build: clean; all 9 routes prerender statically.
- `npm outdated`: only `typescript` (5.9.3 → 7.0.2, held) and `@types/node` (22.x → 26.x, held).
- `npm audit`: 4 moderate, all the accepted `gray-matter` chain (see DECISIONS.md).
- Next 16.4.0, React 19.3, Biome 2.5.15. No CI yet.

## P2 — Dead / misleading config
- [ ] Remove unused `@next/mdx`, `experimental.mdxRs`, `"mdx"` in `pageExtensions`; fix README's MDX line
- [ ] Delete `tailwind.config.js` (ignored by Tailwind v4; dark mode is `@custom-variant`); then drop `allowJs`
- [ ] `globals.css`: remove unused shadcn tokens and the unused `tw-animate-css` import (no `animate-*` classes used)
- [ ] Collapse duplicate color sources (oklch tokens vs hard-coded hex on `<body>`) into zinc theme tokens
- [ ] Drop no-op `scrollbar-hide` class
- [ ] `lib/consts.ts`: remove unused `HOME/BLOG/WORK/PROJECTS`; fix `SITE.NAME` ("My Portfolio") leaking into aria-labels; use consts in the title template

## P3 — Code quality
- [ ] Guard `workEntries[0]` in `app/page.tsx` (renders `[undefined]` if empty)
- [ ] Rename `lib/utils.ts` → `lib/content.ts`; validate frontmatter; add shared `getContentEntries(dir)`
- [ ] ISO dates in frontmatter, formatted at render; unique keys in `Work.tsx` (not `startDate` alone)
- [ ] Homepage hero role text duplicates content; avatar `alt="avatar"`; needless template-literal `className`
- [ ] Extract `ThemeToggle` so `Navbar` isn't a client component; add `<nav aria-label>` + `aria-current`; remove unused `id`
- [ ] Revisit site-wide `<h1>` on the logo (each page should own its `<h1>`)
- [ ] `sitemap.ts`: real `lastModified`; add `alternates.canonical`; per-page OG overrides
- [ ] Minor: Footer trailing space inside link, `BlogPage` async without await

## P4 — Rules, scripts, CI
- [ ] Biome: enable `useSortedClasses` (nursery), `next` + `react` domains, `noUnusedImports/Variables` as errors
- [ ] Scripts: `typecheck` (`tsc --noEmit`) and `check` (lint + typecheck + build)
- [ ] GitHub Actions: lint → typecheck → build → `npm audit --audit-level=high`; Dependabot/Renovate
- [ ] tsconfig: `target` ES2022, `noUncheckedIndexedAccess`

## Blog
- [ ] Build `/blog`; plan and open decisions in [BLOG-PLAN.md](BLOG-PLAN.md). Sequence: P2 → `lib/content.ts` → blog.
