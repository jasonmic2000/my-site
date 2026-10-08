# Decisions log

Decisions already made. Don't reverse without asking. Newest context first within each group.

## Kept on purpose
- **Typography is parked until all other work is done** (owner, 2026-10-08). No font changes in the meantime. The fringing the owner sees is a Windows/ClearType display effect, not a site bug. Findings and the candidate comparison are in `docs/TODO.md` (Parked) and `docs/design/font-pairings.html`.
- **`components/AnimatedArrow.tsx` stays**, though unused (user decision 2026-08-30). Its `<svg>` has a `biome-ignore` for `noSvgWithoutTitle`; the real fix is `aria-hidden="true"` when it's wired in.
- **`productionBrowserSourceMaps: true`** (user decision 2026-08-23): personal site, visible source is fine.
- **TypeScript stays on 5.x until 7.1** (user decision 2026-10-07). TS 7.0 (GA 2026-07-08) trialled clean here: `tsc` 0 errors, build type-check ~1.8s -> ~0.4s, lint fine. Waiting because 7.0 has no stable programmatic API (due in 7.1) and the `next` tsconfig editor plugin may not load on the native compiler. Dependabot ignores TS majors.
- **Node is pinned to `24.x`** (2026-10-07) in `package.json` `engines` and `.nvmrc` (CI reads it); the Vercel project setting must match. Node 24 is the Active LTS (supported to April 2028) and Vercel's default. A range like `>=22` overrides Vercel's setting and picks the newest Node, so keep it an exact major. We left 22 because it reaches EOL in April 2027.
- **Not on Node 26 yet**: it is still "Current" until it enters LTS on 2026-10-28, and Vercel's supported list is 24.x/22.x/20.x. Revisit once it is LTS *and* Vercel supports it; change `engines`, `.nvmrc`, the Vercel setting and `@types/node` together.
- **`@types/node` follows the Node major (`^24`)**, not the npm `latest` tag (26.x).
- **No Content Security Policy** (user decision 2026-10-07). The site has no logins, forms, user input or database; content is self-authored MDX compiled at build time, so there is little for a CSP to protect. A strict nonce-based CSP would force dynamic rendering on every page (no CDN caching, slower loads, higher cost, no ISR/PPR), which isn't worth it. Cheaper options exist if this changes: a no-nonce CSP in `next.config.ts` (keeps static rendering, allows `'unsafe-inline'`, still locks down `object-src`, `base-uri`, `form-action`, `frame-ancestors`) or the experimental hash-based SRI CSP. Revisit if the site ever accepts user input, adds auth, or embeds third-party content. Baseline security headers are set in `next.config.ts`.

## Design principles (user, 2026-10-07)
- **Readability and accessibility come first.** Decorative effects (background texture, parallax, icon animations) must never reduce text contrast below WCAG AA, interfere with keyboard/screen-reader use, or hurt performance.
- **Motion must be opt-out-able.** Every animation respects `prefers-reduced-motion`, and any ambient/scroll-linked motion (e.g. background parallax) additionally gets a visible user toggle, persisted and applied before paint. Avoid anything that could trigger vestibular discomfort: small, slow, scroll-linked, transform-only; no autoplay or looping movement.
- **One accent colour, defined once (`--accent` in `styles/globals.css`, 2026-10-08).** Light `#eb506d` (3.24:1 on the light page), dark `#fb7185` (rose-400, 6.58:1). It is rose-400's hue and intensity, only darker in light mode, because rose-500 was too saturated/pink and rose-400 (2.45:1) fails the 3:1 minimum for large text and UI on light. Use the `text-accent` / `border-accent` / `outline-accent` utilities, never hard-coded rose classes. **Large text, outlines and borders only**: small text needs 4.5:1, so a small accent-coloured link on light would need a darker step (rose-600/700). We stay in the rose family (not true red) because it matches the playful tone and red reads as "error"; the OG image and Apple icon use the dark accent literally since they are dark-background images.
- **Copy style: plain hyphens only** (owner, 2026-10-08). No en or em dashes in site copy, titles, metadata, feeds or posts (use " - " and "7-8"). Blog smart punctuation keeps quotes and ellipses but `dashes: false`.
- **Stay fully static.** New features should not force dynamic rendering (see the CSP decision) unless there is a strong reason.

## Removed / not adopted
- **ESLint + Prettier → Biome only** (2026-08-30). Prettier was never installed. Biome's auto-detected Next domain replaced `eslint-config-next`. Motivated partly by the ESLint 10 incident: `eslint-plugin-react` (via `eslint-config-next`) crashed on ESLint 10's rule-context API change.
- **No Cache Components.** The Next 16 upgrade codemod inserts `export const instant = false;`, which is invalid without `cacheComponents` and breaks the build. Remove it, don't opt in.
- **shadcn removed** (2026-08-30): `components.json`, `cn()`, `clsx`, `tailwind-merge` deleted.
- **`next lint` is gone in Next 16**; lint is `biome check .`.

## Gotchas learned
- Biome suppression comments must sit directly above the flagged JSX attribute, not the enclosing element, or they silently do nothing.
- Biome's CSS parser needs `css.parser.tailwindDirectives: true` for `@apply`/`@theme`/`@custom-variant`.
- `ImageResponse` RCE (GHSA-vcvr-r3jv-pc5j) affected Next 16.2.0–16.3.5, fixed in 16.3.6; now on ≥16.4.0.
- Code-block light theme is `github-light-high-contrast`: the standard `github-light` colours are tuned for white and failed axe `color-contrast` on our zinc-200 block background (found by the Playwright/axe suite; Lighthouse did not flag it). Dark uses `github-dark`.
- Python (and some other scripts) on Windows write `
` as CRLF in text mode; Biome's formatter rejects CRLF. When scripting edits use `newline="
"`, or run `npx biome format --write` on the file.
- Never run `biome check --write --unsafe` on a tree that has parse errors: it treats imports as unused and renames them (`<Footer />` became `<_Footer />`). Fix the syntax first; restore with `git checkout <file>` if it happens.
- Next.js re-adds `allowJs: true` to `tsconfig.json` on build if it's removed, so leave it in (harmless).
