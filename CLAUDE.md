@AGENTS.md

# my-site

Personal portfolio (dev.jasonjmichael.com). Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Biome. Fully static; deployed on Vercel (Node 24).

## Commands
- `npm run dev` — dev server (Turbopack)
- `npm run lint` / `lint:fix` / `format` — Biome (lint + format + import order)
- `npm run typecheck` — `tsc --noEmit`
- `npm run check` — lint + typecheck + build (same as CI)
- `npm run build` — must pass before finishing any change; all routes must stay statically prerendered

- `npm run test:e2e` — Playwright + axe against the production build (run `npm run build` first; locally uses installed Edge, CI installs Chromium)

Verify with lint + typecheck + build, plus `test:e2e` for UI changes (it is part of CI).

## Conventions
- Imports use the `@/*` alias (repo root). Named exports for components (`export const Foo`); default exports only where Next requires (pages, layouts, route files).
- Server Components by default; add `"use client"` only for leaf interactivity. Never import `lib/content.ts` (Node `fs`) from a client component — shared constants live in `lib/consts.ts`.
- Styling: Tailwind utilities, zinc palette, dark mode via `class` + `next-themes`. Shared class fragments are plain string constants (`HOVER_TRANSITION_CLASS`); no `clsx`/`cn()`.
- Accent colour: use the `accent` utilities (`text-accent`, `border-accent`, `outline-accent`) backed by `--accent` in `styles/globals.css`; never hard-code rose classes. Large text/graphics only. See `docs/DECISIONS.md`.
- Copy: plain hyphens only; never en/em dashes in site text, titles or posts.
- Motion/decoration: every animation respects `prefers-reduced-motion`; ambient motion (e.g. background parallax) also needs a user toggle. Text contrast must stay WCAG AA. See `docs/DECISIONS.md` (Design principles).
- Content: `content/<type>/*.mdx` + frontmatter, read at build time via helpers in `lib/` (no external data source).
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `chore(deps):`). After any major, self-contained implementation (lint + typecheck + build passing), commit it with a conventional-commit message. **Never push** — no `git push`, ever, unless explicitly asked in that moment. Keep commits atomic (one concern each); don't bundle unrelated changes.

## Decisions — do not undo without asking
- Biome is the only linter/formatter. Do not add ESLint or Prettier.
- No Cache Components (`cacheComponents` / `export const instant`) — not adopted; the Next 16 upgrade codemod inserts `instant` and breaks the build.
- No shadcn, no `clsx`/`tailwind-merge`.
- `components/AnimatedArrow.tsx` is unused on purpose — keep it.
- `productionBrowserSourceMaps: true` is intentional.
- TypeScript stays on 5.x (TS 7 is the native rewrite; tooling not ready). `@types/node` tracks the Node major (24.x).
- Blog: MDX via `next-mdx-remote-client` (`evaluate`), not `@next/mdx`. Drafts are dev-only. See `docs/ARCHITECTURE.md` (Blog) and `docs/BLOG-PLAN.md`.

## Gotchas
- `npm audit` / `npm outdated` results rot; re-run them before trusting `docs/`.
- Biome `biome-ignore` comments must sit directly above the flagged JSX attribute, not the enclosing element.
- Docs: `docs/ARCHITECTURE.md` (stable), `docs/DECISIONS.md`, `docs/TODO.md` (open items + dated health snapshot), `docs/BLOG-PLAN.md`. Update them when a decision or the architecture changes; check items off in TODO.
