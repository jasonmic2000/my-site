# Open items & health snapshot

Only unfinished work lives here; finished work is in `git log`. Priorities from
the 2026-10-07 architecture review. Check items off (or delete them) as they land.

## Health snapshot (last verified 2026-10-07)
Re-verify with: `npm outdated`, `npm audit`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- Lint, typecheck, build: clean; all 9 routes prerender statically.
- `npm outdated`: only `typescript` (5.9.3 → 7.0.2, held) and `@types/node` (22.x → 26.x, held).
- `npm audit`: 4 moderate, all the accepted `gray-matter` chain (see DECISIONS.md).
- Next 16.4.0, React 19.3, Biome 2.5.15. CI: `.github/workflows/ci.yml` (never run yet; first push will be its first test). Dependabot weekly.

## P2 — Dead / misleading config

## P3 — Code quality
- [ ] Generalize `lib/content.ts` (`readContentDir` + validators) into a shared `getContentEntries` when the blog lands


## Blog
- [ ] Build `/blog`; plan and open decisions in [BLOG-PLAN.md](BLOG-PLAN.md). Next up after the open items above.
