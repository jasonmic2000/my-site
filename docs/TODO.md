# Open items & health snapshot

Only unfinished work lives here; finished work is in `git log`. Check items off (or delete them) as they land.

## Health snapshot (last verified 2026-10-07)
Re-verify with: `npm outdated`, `npm audit`, `npm run lint`, `npm run typecheck`, `npm run build`.
- Lint, typecheck, build: clean; every route prerenders statically (incl. feeds).
- `npm outdated`: only `typescript` (5.9.3 → 7.0.2, held) and `@types/node` (22.x → 26.x, held).
- `npm audit`: 0 vulnerabilities (dropping `gray-matter` removed the js-yaml 3 chain).
- Next 16.4.0, React 19.3, Biome 2.5.15. CI: `.github/workflows/ci.yml` (never run yet; first push will be its first test). Dependabot weekly.

## Blog
- [ ] Write the first real post (remove `draft: true` from, or replace, `content/blog/hello-world.mdx`)
- [ ] Blog v2 backlog: see [BLOG-PLAN.md](BLOG-PLAN.md) (per-post OG images, reading time, TOC, tags)
