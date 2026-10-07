# Decisions log

Decisions already made. Don't reverse without asking. Newest context first within each group.

## Kept on purpose
- **`components/AnimatedArrow.tsx` stays**, though unused (user decision 2026-08-30). Its `<svg>` has a `biome-ignore` for `noSvgWithoutTitle`; the real fix is `aria-hidden="true"` when it's wired in.
- **`productionBrowserSourceMaps: true`** (user decision 2026-08-23): personal site, visible source is fine.
- **TypeScript stays on 5.x**: TS 7 is the native (Go) rewrite; ecosystem/Next type-checking still catching up. Revisit later.
- **`@types/node` stays on 22.x** to match Vercel's Node 22 runtime, not the unrelated 26.x "latest".
- **No CSP**: a strict policy needs per-request nonces (dynamic rendering) and `next-themes` injects an inline script; not worth losing static rendering. Baseline security headers are set in `next.config.ts` instead.

## Removed / not adopted
- **ESLint + Prettier → Biome only** (2026-08-30). Prettier was never installed. Biome's auto-detected Next domain replaced `eslint-config-next`. Motivated partly by the ESLint 10 incident: `eslint-plugin-react` (via `eslint-config-next`) crashed on ESLint 10's rule-context API change.
- **No Cache Components.** The Next 16 upgrade codemod inserts `export const instant = false;`, which is invalid without `cacheComponents` and breaks the build. Remove it, don't opt in.
- **shadcn removed** (2026-08-30): `components.json`, `cn()`, `clsx`, `tailwind-merge` deleted.
- **`next lint` is gone in Next 16**; lint is `biome check .`.

## Accepted risk
- **`gray-matter → js-yaml 3 → argparse → sprintf-js`** (4 moderate in `npm audit`): input is self-authored build-time MDX. `npm audit fix --force` would "fix" it by downgrading to `gray-matter@2.0.1`; do not. Resolved structurally by dropping `gray-matter` in the blog work.

## Gotchas learned
- Biome suppression comments must sit directly above the flagged JSX attribute, not the enclosing element, or they silently do nothing.
- Biome's CSS parser needs `css.parser.tailwindDirectives: true` for `@apply`/`@theme`/`@custom-variant`.
- `ImageResponse` RCE (GHSA-vcvr-r3jv-pc5j) affected Next 16.2.0–16.3.5, fixed in 16.3.6; now on ≥16.4.0.
- `<h1>` lives in `Navbar`'s logo so every route has exactly one (homepage name is `<h2>`). Revisit when blog posts get real titles.
- Next.js re-adds `allowJs: true` to `tsconfig.json` on build if it's removed, so leave it in (harmless).
