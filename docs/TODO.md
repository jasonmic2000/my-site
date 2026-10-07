# Open items & health snapshot

Only unfinished work lives here; finished work is in `git log`. Check items off (or delete them) as they land.

## Health snapshot (last verified 2026-10-07)
Re-verify with: `npm outdated`, `npm audit`, `npm run lint`, `npm run typecheck`, `npm run build`.
- Lint, typecheck, build: clean; every route prerenders statically (incl. feeds).
- `npm outdated`: only `typescript` (5.9.3 → 7.0.2, held) and `@types/node` (24.x → 26.x, held until Node 26).
- `npm audit`: 0 vulnerabilities (dropping `gray-matter` removed the js-yaml 3 chain).
- Next 16.4.0, React 19.3, Biome 2.5.15, Node 24. CI: `.github/workflows/ci.yml` (never run yet; first push will be its first test). Dependabot weekly.

## Blog
- [ ] Replace the placeholder `content/blog/hello-world.mdx` with a real first post
- [ ] Blog v2 backlog: see [BLOG-PLAN.md](BLOG-PLAN.md) (per-post OG images, reading time, TOC, tags)
