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

## P3 — Code quality
- [ ] Generalize `lib/content.ts` (`readContentDir` + validators) into a shared `getContentEntries` when the blog lands
- [ ] Revisit site-wide `<h1>` on the logo (each page should own its `<h1>`)

## P4 — Rules, scripts, CI
- [ ] Biome: enable `useSortedClasses` (nursery), `next` + `react` domains, `noUnusedImports/Variables` as errors
- [ ] Scripts: `typecheck` (`tsc --noEmit`) and `check` (lint + typecheck + build)
- [ ] GitHub Actions: lint → typecheck → build → `npm audit --audit-level=high`; Dependabot/Renovate
- [ ] tsconfig: `target` ES2022, `noUncheckedIndexedAccess`

## Blog
- [ ] Build `/blog`; plan and open decisions in [BLOG-PLAN.md](BLOG-PLAN.md). Sequence: P2 → `lib/content.ts` → blog.
