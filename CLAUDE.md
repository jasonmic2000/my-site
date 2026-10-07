@AGENTS.md

# my-site

Personal portfolio (dev.jasonjmichael.com). Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Biome. Fully static; deployed on Vercel (Node 22).

## Commands
- `npm run dev` — dev server (Turbopack)
- `npm run lint` / `lint:fix` / `format` — Biome (lint + format + import order)
- `npx tsc --noEmit` — typecheck
- `npm run build` — must pass before finishing any change; all routes must stay statically prerendered

Verify with lint + typecheck + build. No test suite yet.

## Conventions
- Imports use the `@/*` alias (repo root). Named exports for components (`export const Foo`); default exports only where Next requires (pages, layouts, route files).
- Server Components by default; add `"use client"` only for leaf interactivity. Never import `lib/utils.ts` (Node `fs`) from a client component — shared constants live in `lib/consts.ts`.
- Styling: Tailwind utilities, zinc palette, dark mode via `class` + `next-themes`. Shared class fragments are plain string constants (`HOVER_TRANSITION_CLASS`); no `clsx`/`cn()`.
- Content: `content/<type>/*.mdx` + frontmatter, read at build time via helpers in `lib/` (no external data source).
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `chore(deps):`). After any major, self-contained implementation (lint + typecheck + build passing), commit it with a conventional-commit message. **Never push** — no `git push`, ever, unless explicitly asked in that moment. Keep commits atomic (one concern each); don't bundle unrelated changes.

## Decisions — do not undo without asking
- Biome is the only linter/formatter. Do not add ESLint or Prettier.
- No Cache Components (`cacheComponents` / `export const instant`) — not adopted; the Next 16 upgrade codemod inserts `instant` and breaks the build.
- No shadcn, no `clsx`/`tailwind-merge`.
- `components/AnimatedArrow.tsx` is unused on purpose — keep it.
- `productionBrowserSourceMaps: true` is intentional.
- TypeScript stays on 5.x (TS 7 is the native rewrite; tooling not ready). `@types/node` stays on 22.x to match Vercel.
- Blog (planned, see `docs/BLOG-PLAN.md`): MDX via `next-mdx-remote-client`, not `@next/mdx`.

## Gotchas
- `npm audit` / `npm outdated` results rot; re-run them before trusting `docs/`.
- Biome `biome-ignore` comments must sit directly above the flagged JSX attribute, not the enclosing element.
- Docs: `docs/ARCHITECTURE.md` (stable), `docs/DECISIONS.md`, `docs/TODO.md` (open items + dated health snapshot), `docs/BLOG-PLAN.md`. Update them when a decision or the architecture changes; check items off in TODO.
