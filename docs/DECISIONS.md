# Decisions log

Decisions already made. Don't reverse without asking. Newest context first within each group.

## Kept on purpose
- **`components/AnimatedArrow.tsx` stays**, though unused (user decision 2026-08-30). Its `<svg>` has a `biome-ignore` for `noSvgWithoutTitle`; the real fix is `aria-hidden="true"` when it's wired in.
- **`productionBrowserSourceMaps: true`** (user decision 2026-08-23): personal site, visible source is fine.
- **TypeScript stays on 5.x until 7.1** (user decision 2026-10-07). TS 7.0 (GA 2026-07-08) trialled clean here: `tsc` 0 errors, build type-check ~1.8s -> ~0.4s, lint fine. Waiting because 7.0 has no stable programmatic API (due in 7.1) and the `next` tsconfig editor plugin may not load on the native compiler. Dependabot ignores TS majors.
- **Node is pinned to `24.x`** (2026-10-07) in `package.json` `engines` and `.nvmrc` (CI reads it); the Vercel project setting must match. Node 24 is the Active LTS (supported to April 2028) and Vercel's default. A range like `>=22` overrides Vercel's setting and picks the newest Node, so keep it an exact major. We left 22 because it reaches EOL in April 2027.
- **Not on Node 26 yet**: it is still "Current" until it enters LTS on 2026-10-28, and Vercel's supported list is 24.x/22.x/20.x. Revisit once it is LTS *and* Vercel supports it; change `engines`, `.nvmrc`, the Vercel setting and `@types/node` together.
- **`@types/node` follows the Node major (`^24`)**, not the npm `latest` tag (26.x).
- **No Content Security Policy** (user decision 2026-10-07). The site has no logins, forms, user input or database; content is self-authored MDX compiled at build time, so there is little for a CSP to protect. A strict nonce-based CSP would force dynamic rendering on every page (no CDN caching, slower loads, higher cost, no ISR/PPR), which isn't worth it. Cheaper options exist if this changes: a no-nonce CSP in `next.config.ts` (keeps static rendering, allows `'unsafe-inline'`, still locks down `object-src`, `base-uri`, `form-action`, `frame-ancestors`) or the experimental hash-based SRI CSP. Revisit if the site ever accepts user input, adds auth, or embeds third-party content. Baseline security headers are set in `next.config.ts`.

## Removed / not adopted
- **ESLint + Prettier → Biome only** (2026-08-30). Prettier was never installed. Biome's auto-detected Next domain replaced `eslint-config-next`. Motivated partly by the ESLint 10 incident: `eslint-plugin-react` (via `eslint-config-next`) crashed on ESLint 10's rule-context API change.
- **No Cache Components.** The Next 16 upgrade codemod inserts `export const instant = false;`, which is invalid without `cacheComponents` and breaks the build. Remove it, don't opt in.
- **shadcn removed** (2026-08-30): `components.json`, `cn()`, `clsx`, `tailwind-merge` deleted.
- **`next lint` is gone in Next 16**; lint is `biome check .`.

## Gotchas learned
- Biome suppression comments must sit directly above the flagged JSX attribute, not the enclosing element, or they silently do nothing.
- Biome's CSS parser needs `css.parser.tailwindDirectives: true` for `@apply`/`@theme`/`@custom-variant`.
- `ImageResponse` RCE (GHSA-vcvr-r3jv-pc5j) affected Next 16.2.0–16.3.5, fixed in 16.3.6; now on ≥16.4.0.
- Next.js re-adds `allowJs: true` to `tsconfig.json` on build if it's removed, so leave it in (harmless).
