# Codebase Notes

Living notes on the architecture of this repo, plus open recommendations and
audit findings from review sessions. Unlike a spec, this doc is expected to
go stale — check off items as they're done, and re-verify dependency
versions/audit results before acting on them since they're snapshots in time.

Last updated: 2026-08-30

---

## 1. Architecture & structure overview

### Tech stack
- **Framework**: Next.js 16.3.3 (App Router), React 19.2.8 — upgraded from
  15.3.2 on 2026-08-23, see §4
- **Language**: TypeScript (strict mode), path alias `@/*` → repo root
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), `tailwind-merge` +
  `clsx` via a `cn()` helper, dark mode via the `class` strategy
- **Theming**: `next-themes` (system/light/dark, toggle lives in `Navbar`)
- **Content**: MDX + frontmatter (`@next/mdx`, `mdxRs: true`) parsed with
  `gray-matter`, body rendered via `remark`/`remark-html`
- **Fonts**: `next/font/google` (Geist Sans/Mono)
- **Icons**: `react-icons`
- **Linting**: ESLint 9 (9.39.5) flat config, using `eslint-config-next`'s
  native flat-config exports (`eslint-config-next/core-web-vitals`,
  `eslint-config-next/typescript`) directly + `eslint-config-prettier`. Run
  via `npm run lint` → `eslint .` (the old `next lint` subcommand was
  removed in Next 16). **ESLint 10 is not yet usable here** — see §6.
- **Build tooling**: `next dev --turbopack` for dev, standard `next build`/
  `next start`
- **Deploy**: Vercel (`@vercel/speed-insights` wired into root layout),
  production domain `dev.jasonjmichael.com`

### Routing (`app/`, App Router)
Flat structure, one folder per route:
- `app/layout.tsx` — root layout: fonts, global metadata (title template
  `"%s – Jason Michael"`, OG/Twitter cards sourced from `lib/consts.ts`),
  wraps children in `Providers` (theme) + `Navbar`/`Footer`, fixed-width
  centered shell (`max-w-[640px]`)
- `app/page.tsx` (`/`) — bio + most recent `Work` entry + `Connect`
- `app/work/page.tsx` (`/work`) — full work history via `getAllWorkEntries()`
- `app/blog/page.tsx` (`/blog`) — placeholder, "under construction"
- No dynamic routes yet (`[slug]`), no API routes, no middleware, no route
  groups

### Components (`components/`)
Flat, ungrouped, five files: `Navbar` (client component, theme toggle + nav
links), `Footer`, `Work` (renders work entries), `Connect` (contact/socials),
`AnimatedArrow`. Appropriate for current site size — no need for
subfolders yet.

### Content/data layer
`content/work/*.mdx` (frontmatter: `company`, `role`, `startDate`,
`endDate`) + `lib/utils.ts`'s `getAllWorkEntries()`, which does a
filesystem read (`fs.readdirSync`/`readFileSync`), parses frontmatter with
`gray-matter`, converts the MD body to an HTML string via `remark`, and
sorts by `startDate` descending. A small file-based CMS pattern — no
external data source.

### State management
Essentially none beyond theme. `next-themes`'s `ThemeProvider`
(`app/providers.tsx`) is the only real "state" in the app, read via
`useTheme()` in `Navbar.tsx`. No Context, no client store, no form state —
appropriate for a static content site.

### Data fetching
Purely build-/server-side filesystem reads, called from async Server
Components (`app/page.tsx`, `app/work/page.tsx`). No client-side fetch, no
API routes, no external services.

### Historical note
Earlier design explorations ("Astro Nano" and "Astrofolio" styles) were
kept as large commented-out blocks in `app/page.tsx` and `Navbar.tsx` before
settling on the current layout. These were removed in commit
`96a723a chore: remove Astro Nano/Astrofolio draft designs, kept in history`
— full prior versions remain retrievable via `git log -p` / `git show` on
those files if needed for reference, no need to keep them live in-file.

---

## 2. Open recommendations (structure/architecture)

- [ ] Extract a shared `getContentEntries(dir)`-style helper if/when a second
  MDX-backed content type is added (e.g. `content/blog/`), instead of
  copy-pasting `getAllWorkEntries`-style functions per content type.
- [ ] `Work.tsx` uses `dangerouslySetInnerHTML` for `detailsHtml` — safe today
  since MDX content is self-authored, but worth a one-line comment noting
  that assumption so it doesn't read as an oversight later.
- [x] `AnimatedArrow.tsx` is unused (no imports anywhere) — **explicit user
  decision 2026-08-30: keep as-is, do not remove**. Still unused; revisit
  only if asked.
- [x] ~~Decide on shadcn~~ — **resolved 2026-08-30, user decision: remove**.
  `components.json` deleted; the site keeps its current hand-rolled
  component style. Note: `cn()` (originally shadcn boilerplate, formerly in
  `lib/utils.ts`) was separately removed as unused dead code — see §6.
- [ ] Blog route (`/blog`) is a static placeholder. When built out, it's a
  natural fit for the same MDX+frontmatter pattern proven in
  `content/work/`, but will likely want individual permalinks
  (`app/blog/[slug]/page.tsx`), unlike work entries which render as a
  single list.

---

## 3. Dependency audit

Re-run `npm outdated` / `npm audit` before acting on this — versions move.

### Outdated packages (snapshot: 2026-08-30, post safe-bump round 2)

| Package | Current | Latest | Bump type |
|---|---|---|---|
| eslint | 9.39.5 | 10.9.1 | major — **do not bump yet, see §6** |
| typescript | 5.9.3 | 7.0.2 | major — **intentionally held, see §4 step 6** |

Everything else is now at latest: `next`/`eslint-config-next`/`@next/mdx`
16.3.3, `react`/`react-dom` 19.2.8, `@types/react` 19.2.18,
`@types/react-dom` 19.2.5, `@vercel/speed-insights` ^2.0.0,
`tailwindcss`/`@tailwindcss/postcss` 4.3.3, `tailwind-merge` 3.6.0,
`tw-animate-css` 1.4.0, `react-icons` 5.7.0, `eslint-config-prettier`
10.1.8, `@types/node` `^22` (latest 22.x line) — all bumped 2026-08-30,
`npm run build` and `npm run lint` both verified clean after. Only the two
intentionally-held items above remain outdated.

### ~~`npm audit` findings~~ (superseded, see §4/§6 for current state)
Timeline: 13 advisories (2026-08-13, Next 15.3.2) → 6 advisories
(2026-08-23, after the Next 16 major) → **4 advisories (1 moderate, 3
high)** as of 2026-08-30, after the round-2 safe bump (tailwind bump alone
dropped one). `next` has not reappeared in the audit output since the v16
upgrade. Everything remaining (`mdast-util-to-hast` plus a small number of
others) is transitive dev-toolchain noise from the
ESLint/typescript-eslint/remark dependency tree, not reachable through
this site's runtime.

### Unused dependencies
None found. Every entry in `dependencies` and `devDependencies` was checked
against actual imports (including CSS-only imports like `tw-animate-css`
in `styles/globals.css`) — all are referenced somewhere.

### Correction / gap noted
Despite `eslint-config-prettier` being present, **Prettier itself is not
installed** — no `prettier` package, no `.prettierrc`, no format script.
`eslint-config-prettier` only disables ESLint rules that would conflict
with Prettier; nothing is currently enforcing formatting in this repo.

---

## 4. Upgrade plan (to latest stable across the board)

Batched by risk — don't do this all in one shot.

1. [x] **Safe bulk bump** — done in two rounds. Round 1 (2026-08-23, with
   the Next 16 upgrade): `react`/`react-dom` → 19.2.8, `@types/react` →
   19.2.18, `@types/react-dom` → 19.2.4. Round 2 (2026-08-30): the rest —
   `tailwindcss`/`@tailwindcss/postcss` → 4.3.3, `tailwind-merge` → 3.6.0,
   `tw-animate-css` → 1.4.0, `react-icons` → 5.7.0, `eslint-config-prettier`
   → 10.1.8, plus `next`/`eslint-config-next`/`@next/mdx` patch bump to
   16.3.3. Build + lint verified clean after each round.
2. [x] ~~Next.js 15.3.2 → 15.5.23~~ — done 2026-08-23, then immediately
   superseded by step 3 the same day.
3. [x] **Next.js 15 → 16 (major)** — done 2026-08-23. `next`,
   `eslint-config-next`, `@next/mdx` all bumped to `16.3.2` together.
   **Two things broke and were fixed as part of this** (full detail in
   §6):
   - The upgrade codemod inserted `export const instant = false;` (a Cache
     Components route-segment opt-out) into `app/layout.tsx` and all three
     page files, but the project doesn't have `cacheComponents` enabled in
     `next.config.ts` — so the config key was invalid and broke the build
     (`Route segment config "instant" requires nextConfig.cacheComponents
     to be enabled`). Removed all four instances rather than opting into
     Cache Components, since that's a deliberate feature adoption this repo
     hasn't asked for.
   - `next lint` was removed as a CLI command in Next 16. `package.json`'s
     `lint` script now runs `eslint .` directly.
4. [x] **ESLint 9 → 10 — attempted, reverted.** `eslint-config-next@16.3.2`
   declares `eslint: ">=9.0.0"` as a peer (so npm allows ESLint 10), but its
   bundled `eslint-plugin-react` is not actually compatible with ESLint
   10's rule-context API changes and crashes at lint time (see §6).
   Rolled back to latest ESLint 9 (`9.39.5`). **Don't retry this until
   `eslint-config-next` (or its bundled `eslint-plugin-react`) ships a
   fix** — re-check `npm ls eslint-plugin-react` and try again on the next
   `eslint-config-next` release.
5. [x] **@vercel/speed-insights 1 → 2 (major)** — done 2026-08-30. Bumped
   to `^2.0.0`; the `<SpeedInsights />` import in `app/layout.tsx` needed no
   changes, `npm run build` + `npm run lint` both verified clean.
6. [x] **TypeScript → 5.9.3** — done 2026-08-30, bumped from 5.8.3 within
   the 5.x line as planned. Still **not** jumping to `7.0.2`: TS 7 is the
   new Go-based native-compiler rewrite, a different implementation rather
   than a version bump; ecosystem tooling (ESLint plugins, Next's
   type-checking) is still catching up. Revisit later.
7. [x] **@types/node → `^22`** — done 2026-08-30. User confirmed Vercel
   runs the same major as local dev (v22.x), so bumped from `^20` to `^22`
   (latest 22.x line) rather than jumping to the unrelated `26.x` "latest"
   tag. Verified clean build + lint after.

---

## 5. ESLint + Prettier → Biome migration plan

Since Prettier was never actually installed here (see gap noted above),
this is a clean-slate move rather than a true migration.

1. [ ] `npm install --save-dev --save-exact @biomejs/biome`, then
   `npx biome init` to generate `biome.json`.
2. [ ] **Known gap**: `eslint-config-next` provides Next.js-specific lint
   rules (e.g. flagging raw `<img>`/`<a>` instead of `next/image`/
   `next/link`, rules-of-hooks) that Biome has no equivalent for, being
   framework-agnostic. Decide: drop Next-specific linting entirely (likely
   fine — current code already uses `next/image`/`next/link` correctly),
   or keep a slimmed-down ESLint just for `eslint-config-next` alongside
   Biome.
3. [ ] Configure `biome.json` formatter + linter to match current code style
   (double quotes, semicolons, as used throughout `app/`/`components/`).
   Note: no Tailwind-class-sorting equivalent to
   `prettier-plugin-tailwindcss` exists in Biome — but that plugin was
   never installed here either, so nothing is lost.
4. [ ] Update `package.json` scripts: replace `"lint": "eslint ."` with
   `"lint": "biome check ."` (or split `biome lint .` / `biome format
   --write .`). (Note: the script already changed once, from `next lint` to
   `eslint .`, when `next lint` was removed in the Next 16 upgrade — see
   §4/§6.)
5. [ ] Remove `eslint`, `eslint-config-next` (if dropping Next-specific
   linting), `eslint-config-prettier` from devDependencies; delete
   `eslint.config.mjs`. (`@eslint/eslintrc` is already gone — it was
   dropped when `eslint.config.mjs` was rewritten to use
   `eslint-config-next`'s native flat-config exports instead of the legacy
   `FlatCompat` shim, see §6.)
6. [ ] If using VS Code, swap the ESLint extension for the Biome extension
   and set it as the default formatter.

Given the repo's current size (4 routes, 5 components, 2 lib files), this
is roughly a 20-minute job whenever it's prioritized.

---

## 6. Code quality analysis (snapshot: 2026-08-13)

### ✅ Fixed — production build was broken
`components/Navbar.tsx` had lost its `return` statement, almost certainly
during the manual removal of the old Astro Nano/Astrofolio commented
drafts, leaving the JSX as an orphaned expression so `Navbar` implicitly
returned `void` (`TS2786`, confirmed via both `next build` and a standalone
`tsc --noEmit`). **Fixed 2026-08-13** — `return (...)` restored.
`npm run build` now compiles, type-checks, and prerenders all 6 pages
cleanly:

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    5.58 kB         110 kB
├ ○ /_not-found                          1.02 kB         102 kB
├ ○ /blog                                  136 B         101 kB
└ ○ /work                                  220 B         105 kB
+ First Load JS shared by all             101 kB
```
- [x] Fix missing `return` in `components/Navbar.tsx`

### ✅ Fixed — Next 16 upgrade broke the build a second time
The Next 15→16 upgrade codemod added `export const instant = false;` (a
Cache Components route-segment opt-out marker, with a `TODO: Cache
Components adoption` comment) to `app/layout.tsx`, `app/page.tsx`,
`app/work/page.tsx`, and `app/blog/page.tsx`. This key is only valid when
`nextConfig.cacheComponents` is enabled — which it isn't here — so every
route with the marker failed to build:
`Route segment config "instant" requires nextConfig.cacheComponents to be
enabled`. **Fixed 2026-08-23** by removing all four instances rather than
turning on Cache Components, since adopting that caching model is a
deliberate architectural decision this repo hasn't made, not a
prerequisite for upgrading.
- [x] Remove invalid `export const instant = false;` from all 4 route
  files

### ✅ Fixed — `next lint` removed in Next 16
`package.json`'s `"lint": "next lint"` script broke (`Invalid project
directory provided, no such directory: .../lint`) because Next 16 dropped
the built-in `next lint` CLI command entirely. **Fixed 2026-08-23** —
script now runs `"lint": "eslint ."` directly. This also required rewriting
`eslint.config.mjs`: the old config used the legacy `FlatCompat` shim
(`@eslint/eslintrc`) to load `next/core-web-vitals` etc. as
eslintrc-style strings, but `eslint-config-next@16.3.2` now ships native
flat-config arrays directly (`eslint-config-next/core-web-vitals`,
`eslint-config-next/typescript`). Rewrote the config to import those
directly, which also let `@eslint/eslintrc` be dropped as a dependency
entirely (it's no longer used anywhere).
- [x] Fix `lint` script for Next 16
- [x] Rewrite `eslint.config.mjs` to use native flat-config exports

### 🟠 Blocked — ESLint 10 is not usable with `eslint-config-next` yet
Attempted bumping `eslint` 9 → 10 alongside the Next 16 upgrade (see §4
step 4). It installs fine (peer range `>=9.0.0` allows it), but linting
crashes: `TypeError: Error while loading rule 'react/display-name':
contextOrFilename.getFilename is not a function`. This is
`eslint-config-next`'s bundled `eslint-plugin-react` (`^7.37.0`) calling
an ESLint rule-context method (`context.getFilename()`) that ESLint 10
removed/changed. **Reverted to latest ESLint 9 (`9.39.5`)** — this isn't
something fixable in this repo; it needs an upstream fix in
`eslint-plugin-react` or `eslint-config-next`. Re-attempt later.
- [ ] Re-check ESLint 10 compatibility next time `eslint-config-next` is
  updated

### 🟠 Real bugs
- [x] ~~`Connect.tsx:25` — `target="__blank"` typo~~ **Fixed 2026-08-13** —
  corrected to `target="_blank"`.
  - [x] ~~Missing `rel="noopener noreferrer"`~~ — **fixed 2026-08-23**,
    added to the social links alongside `target="_blank"`. Reverse-tabnabbing
    gap fully closed.

### 🟡 Dead code
- [x] ~~`cn()` in `lib/utils.ts`~~ — **removed 2026-08-30**. Confirmed no
  callers anywhere in the codebase, then deleted along with the now-fully-
  unused `clsx`/`tailwind-merge` dependencies (`npm install` pruned both
  from `node_modules`/lockfile — 2 packages removed).
- [x] `AnimatedArrow.tsx` — **kept, per explicit user decision 2026-08-30**.
  Still unused (no imports anywhere), but intentionally left in place —
  do not remove without asking again.
- [x] ~~Leftover commented-out fields~~ — **removed 2026-08-30**. Dropped
  the commented `NUM_POSTS_ON_HOMEPAGE`/`NUM_WORKS_ON_HOMEPAGE`/
  `NUM_PROJECTS_ON_HOMEPAGE` fields from `lib/consts.ts` and the commented
  `slug` field (plus its matching commented return-line) from
  `lib/utils.ts`.

### 🟡 Duplicated logic
- [x] ~~Hand-repeated hover/transition utility-class string~~ — **fixed
  2026-08-30**. Extracted to `HOVER_TRANSITION_CLASS` in `lib/consts.ts`
  (`"transition duration-300 ease-in-out hover:text-black
  dark:hover:text-white"`) and applied at all 7 sites across `Navbar.tsx`
  (×3), `Connect.tsx` (×2), `Footer.tsx` (×1), `Work.tsx` (×1). Two real
  inconsistencies got fixed as a side effect of normalizing to one
  constant: `Navbar.tsx`'s nav-item links used `transition-all` instead of
  the plain `transition` every other instance used (no other animated
  properties there, so this was strictly more expensive for no benefit),
  and `Work.tsx`'s "See all work" link had the modifier order reversed
  (`hover:dark:text-white` instead of `dark:hover:text-white`).
  **Placement note**: initially added to `lib/utils.ts` (which already held
  the removed `cn()` helper) but that file imports Node-only modules
  (`fs`, `path`, `gray-matter`, `remark`) — since `Navbar.tsx` is a client
  component (`"use client"`), importing anything from `lib/utils.ts` there
  pulled those Node built-ins into the client bundle and broke the build.
  Moved to `lib/consts.ts` instead, which has no server-only dependencies
  and is already safe to import from both client and server components.

### ✅ Fixed — inconsistent patterns
- [x] ~~Mixed import styles in `app/layout.tsx`~~ — **fixed 2026-08-30**.
  `../styles/globals.css` → `@/styles/globals.css`,
  `../components/Navbar` → `@/components/Navbar`. Every import in the repo
  now consistently uses the `@/*` alias.
- [x] ~~Mixed export conventions~~ — **fixed 2026-08-30**. `Navbar` and
  `Work` converted from `export default` to named exports
  (`export const Navbar`/`export const Work`), matching `Connect` and
  `Footer`. Updated all call sites: `app/layout.tsx`, `app/page.tsx`,
  `app/work/page.tsx`.
- [ ] **`"use client"` quote style** — double quotes in `Navbar.tsx`, single
  quotes in `app/providers.tsx`. Still open — cosmetic, and exactly the
  kind of thing Biome/Prettier would auto-normalize (see §5), so left for
  that pass rather than a manual one-off fix.
- [ ] **List `key` strategy** — `Work.tsx` keys on the stable
  `entry.startDate`; `Navbar.tsx` keys nav items on array `index`. Still
  open, low risk today since the nav list is static.

### ✅ Fixed — structural/semantic HTML issue (also an accessibility finding, see §7)
`components/Work.tsx` used to render a **separate `<ul>` per work entry
inside the `.map()`**, each containing exactly one `<li>`, which is
announced to screen readers as N separate single-item lists instead of one
N-item list. **Fixed 2026-08-23** — now a single `<ul>` wraps the
`.map()`, with `<li>` as the repeated child.
- [x] Fix `Work.tsx` list structure

---

## 7. Build & performance analysis (snapshot: 2026-08-13, re-verified 2026-08-23)

### Bundle size
Original measurement (Next 15.5.23, 2026-08-13):
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    5.58 kB         110 kB
├ ○ /_not-found                          1.02 kB         102 kB
├ ○ /blog                                  136 B         101 kB
└ ○ /work                                  220 B         105 kB
+ First Load JS shared by all             101 kB
```
Next 16's build output no longer prints the per-route size table (Turbopack
build output changed format) — re-verified 2026-08-23 on Next 16.3.2 via
raw chunk sizes in `.next/static/chunks` instead: largest chunks ~224K,
~164K, ~112K, tapering down to single-digit KB — same rough shape as
before, no regression. All 4 routes (`/`, `/blog`, `/work`, `/_not-found`)
still prerender as fully static content. Nothing in the dependency list is
large enough to be a standout bundle concern; no action needed here.

### Likely causes of Lighthouse Accessibility not being 100
- [x] ~~No `<h1>` anywhere in the site~~ — **fully fixed 2026-08-23**.
  Superseded the homepage-only fix: `components/Navbar.tsx`'s logo/home-link
  (`¯\_(ツ)_/¯`) is now wrapped in `<h1>` (heading wraps the `Link`, not the
  other way around), and since `Navbar` renders from the shared root layout
  (`app/layout.tsx`), every route (`/`, `/work`, `/blog`) now gets exactly
  one `<h1>` for free. This meant the homepage's `"Jason Michael"` heading
  in `app/page.tsx` had to be demoted from `<h1>` to `<h2>` to avoid two
  `<h1>`s on that page — kept the identical classes
  (`text-[2rem] font-extrabold`), so **no visual size change**: Tailwind's
  preflight (bundled via `@import "tailwindcss"`) strips default browser
  heading styles, so font-size/weight come entirely from utility classes,
  not the tag.
- [x] ~~Structural list issue in `Work.tsx`~~ — **fixed 2026-08-23**, see
  §6.
- [x] ~~Low-contrast secondary text via opacity~~ — **fixed 2026-08-23**,
  see recommended fix below (applied as written).

#### Fix applied for the `opacity-75` secondary text
Only used in two spots, both in `components/Work.tsx` (role and date/range
text). Manually computing the effective contrast (opacity blends the text
color with the solid page background behind it):
- **Light mode**: base text `#3F3F46` at 75% opacity over bg `#F4F4F5` →
  effective ratio ≈ **4.76:1** — technically passes WCAG AA (4.5:1) but
  only barely, close enough to the cutoff that font-weight/anti-aliasing
  differences could tip Lighthouse's automated check either way.
- **Dark mode**: base text `#D4D4D8` at 75% opacity over bg `#18181B` →
  effective ratio ≈ **7.2:1** — comfortably passes.
So light mode is the marginal case and the most likely actual culprit.
**Fix**: drop `opacity-75` and use a fixed, verified-contrast color
instead. Handy detail: the site's existing hardcoded body colors
(`#F4F4F5` / `#3F3F46` light, `#18181B` / `#D4D4D8` dark, all set directly
in `app/layout.tsx`) are exact matches for Tailwind's stock
`zinc-100` / `zinc-700` / `zinc-900` / `zinc-300` — so this is already a
zinc-based palette, just written as raw hex instead of the named
utilities. Staying in that same family, `zinc-600` (light) /
`zinc-400` (dark) both check out well clear of AA:
  - `text-zinc-600` on `#F4F4F5` ≈ **7.1:1**
  - `dark:text-zinc-400` on `#18181B` ≈ **6.9:1**
  Change applied in `Work.tsx`:
  ```diff
  - <p className="text-sm opacity-75">{entry.role}</p>
  + <p className="text-sm text-zinc-600 dark:text-zinc-400">{entry.role}</p>
  ...
  - <span className="text-sm opacity-75">
  + <span className="text-sm text-zinc-600 dark:text-zinc-400">
  ```
  This both fixes the marginal contrast case and gives real headroom
  instead of sitting right on the AA line. Verified `npm run build` and
  `npm run lint` both still pass clean after the change.

### `productionBrowserSourceMaps: true` — kept intentionally
Previously flagged as a Best Practices consideration (ships full readable
source to production). **User decision 2026-08-23: keep it** — this is a
personal/portfolio site and the source being visible to anyone curious is
fine. No longer tracked as an action item; noted here so the reasoning
isn't lost if it comes up again later.

### Likely causes of Lighthouse Best Practices not being 100
- [x] ~~Missing `rel="noopener noreferrer"`~~ — **fixed 2026-08-23**, see
  §6.
- [x] ~~Running Next.js 15.3.2 with published CVEs~~ — **resolved
  2026-08-23**, now on Next 16.3.2, and `next` no longer appears at all in
  `npm audit` output (see §3).
- `productionBrowserSourceMaps: true` — **kept intentionally**, see note
  above under the accessibility/opacity section. Not tracked as an action
  item.

Worth re-running Lighthouse now to see where the score actually lands —
both known causes in this tier are resolved.

### Image optimization
- [x] ~~Avatar image hotlinked from `i.pinimg.com`~~ — **fixed 2026-08-23**.
  Now self-hosted at `public/luffy-wano-avatar.jpg` (15.8 KB) and served via
  `next/image` from `/luffy-wano-avatar.jpg`. As a follow-up cleanup, the
  now-unused `images.remotePatterns` entry for `i.pinimg.com` was removed
  from `next.config.ts` (nothing in the codebase references that host
  anymore — verified by grep).
- [x] ~~Missing `priority` on the avatar `<Image>`~~ — **fixed
  2026-08-23**, `priority={true}` was added. **This is the correct value,
  not `false`**: `priority` tells Next.js to preload the image and skip
  lazy-loading, which is exactly what you want for an image that's visible
  immediately on page load without scrolling (the homepage avatar sits in
  the hero section, above the fold) — and it's very likely this page's LCP
  (Largest Contentful Paint) element, which is the specific Lighthouse
  metric this was meant to help. `priority={false}` (or omitting it) is the
  default and is correct for below-the-fold images that should lazy-load
  instead — not the case here.
- [x] ~~No `apple-touch-icon` or Open Graph share image~~ — **fixed
  2026-08-30**. Added `app/opengraph-image.tsx` and `app/apple-icon.tsx`,
  both using Next's file-convention dynamic image generation
  (`ImageResponse` from `next/og`) rather than static assets — no external
  image tooling needed, generated at build time as static routes
  (confirmed via `npm run build`: `○ /apple-icon`, `○ /opengraph-image`).
  Both match the site's existing rose-400/zinc branding (verified visually:
  OG card is 1200×630 with "Jason **Michael**" + tagline on a `#18181B`
  background; apple icon is a 180×180 "JM" monogram, same palette). Next
  auto-registers these into the resolved `openGraph`/icon metadata — no
  manual changes needed in `app/layout.tsx`'s `metadata` export.
  `public/favicon.ico` (28K) was left as-is, not in scope for this pass.
- [x] ~~No `app/robots.ts` or `app/sitemap.ts`~~ — **fixed 2026-08-30**.
  Both added using Next's typed `MetadataRoute.Robots`/`MetadataRoute.Sitemap`
  file conventions, sourcing the site URL from `DEFAULT_METADATA` in
  `lib/consts.ts` rather than hardcoding it again. `sitemap.ts` currently
  lists the 3 static routes (`/`, `/work`, `/blog`) by hand — if `/blog`
  ever grows per-post permalinks (see §2), this will need to generate
  entries per post instead of a fixed array.
- [x] ~~No `manifest.json`~~ — **fixed 2026-08-30**, added `app/manifest.ts`
  (typed `MetadataRoute.Manifest`), reusing the existing `favicon.ico` as
  its icon rather than introducing a new asset.

All four routes confirmed generating correctly via `npm run build`:
`/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image`,
`/apple-icon`.

---

## 8. Prioritized to-do list (as of 2026-08-30)

Synthesized from §§2–7. Ordered by urgency within each tier, not by effort.
Re-check off items directly here as they land — this list will drift from
the detailed sections above over time, so treat the sections as the source
of truth and this as a routing map into them.

### 🔒 Security
1. [x] ~~Add `rel="noopener noreferrer"` to the `target="_blank"` links in
   `Connect.tsx`~~ — **fixed 2026-08-23**. Reverse-tabnabbing gap closed.
   *(§6, §7)*
2. [x] ~~Bump Next.js past 15.5.23~~ — **done 2026-08-23, taken all the way
   to 16.3.2.** `next` no longer appears in `npm audit` at all (the direct
   CVEs were fixed by the 15.5.23 patch; the transitive `postcss`/`sharp`
   vulnerabilities bundled with it needed the full v16 major to clear).
   *(§3, §4 step 3)*
3. [x] **`productionBrowserSourceMaps`** — **kept intentionally per user
   decision 2026-08-23** (personal site, fine for source to be visible).
   No longer an action item. *(§7)*

### 🚧 Major — real bugs, broken/degraded behavior, accessibility failures
1. [x] ~~Missing `return` in `Navbar.tsx` (broke `next build` entirely)~~ —
   **fixed**.
2. [x] ~~`target="__blank"` typo~~ — **fixed**.
3. [x] ~~Next 16 upgrade broke the build via an invalid `instant` route
   segment config~~ — **fixed 2026-08-23**, see §6.
4. [x] ~~`next lint` removed in Next 16, broke the lint script~~ — **fixed
   2026-08-23**, `lint` now runs `eslint .` directly, see §6.
5. [x] ~~Fix `Work.tsx`'s list structure~~ — **fixed 2026-08-23**, see §6.
6. [x] ~~Self-host the avatar image and add `priority` to its `<Image>`~~ —
   **fixed 2026-08-23**. Now served from `public/luffy-wano-avatar.jpg`
   with `priority={true}` (confirmed correct — see §7). Unused
   `remotePatterns` config for the old host was also cleaned up. *(§7)*
7. [x] ~~Add an `<h1>` to every page~~ — **fully fixed 2026-08-23**. Moved
   the `<h1>` to the shared `Navbar` logo/home-link instead of keeping it
   homepage-only, so `/`, `/work`, and `/blog` all get exactly one `<h1>`
   from the shared root layout. Homepage's `"Jason Michael"` demoted to
   `<h2>` (same visual size) to avoid a duplicate. *(§7)*
8. [x] ~~Replace `opacity-75` secondary text with a fixed, contrast-checked
   color~~ — **fixed 2026-08-23**. Swapped to `text-zinc-600
   dark:text-zinc-400` in `Work.tsx` (~7:1 contrast both modes, vs. the
   prior borderline ~4.76:1 in light mode). *(§7)*

All items in the Major and Security tiers are now fully resolved,
including the `<h1>` gap (see item 7 above).

### 🧹 Nice to have — cleanup, DX, future-proofing, non-urgent upgrades
- [x] ~~Remaining safe dependency bump~~ — **done 2026-08-30**:
  `tailwindcss`/`@tailwindcss/postcss` 4.3.3, `tailwind-merge` 3.6.0,
  `tw-animate-css` 1.4.0, `react-icons` 5.7.0, `eslint-config-prettier`
  10.1.8, plus `next`/`eslint-config-next`/`@next/mdx` patch → 16.3.3.
  *(§3, §4 step 1)*
- [x] ~~`@vercel/speed-insights` 1 → 2 major upgrade~~ — **done
  2026-08-30**. *(§4 step 5)*
- [x] ~~TypeScript: bump within 5.x~~ — **done 2026-08-30**, now `5.9.3`.
  Still intentionally not on `7.x`. *(§4 step 6)*
- [x] ~~`@types/node`~~ — **done 2026-08-30**, bumped to `^22` after user
  confirmed Vercel matches local dev's Node 22.x. *(§4 step 7)*
- [ ] Re-attempt ESLint 9 → 10 once `eslint-config-next`'s bundled
  `eslint-plugin-react` supports ESLint 10's rule-context API — currently
  blocked upstream, not something fixable in this repo. *(§4 step 4, §6)*
- [ ] ESLint+Prettier → Biome migration. *(§5, full plan)*
- [x] ~~Add an Open Graph share image, `apple-touch-icon`, and
  `manifest.json`; add `app/robots.ts`/`app/sitemap.ts`~~ — **done
  2026-08-30**, see §7 Image optimization section for full detail. *(§7)*
- [x] ~~Remove dead code~~ — **done 2026-08-30**: unused `cn()` helper and
  leftover commented-out fields removed. `AnimatedArrow.tsx` deliberately
  **kept** per user decision — not a leftover, don't remove it. *(§6)*
- [x] ~~Extract the repeated hover/transition class string~~ — **done
  2026-08-30**, `HOVER_TRANSITION_CLASS` in `lib/consts.ts`, applied at all
  7 sites. *(§6)*
- [x] ~~Standardize import style and export convention~~ — **done
  2026-08-30**: `layout.tsx` now uses `@/*` alias throughout; `Navbar` and
  `Work` converted to named exports. *(§6)*
- [x] ~~Decide on shadcn~~ — **done 2026-08-30, removed**. See §1/§2. *(§2)*
- [ ] Build out the `/blog` route with the same MDX pattern as `/work`,
  with per-post permalinks — note `app/sitemap.ts` will need updating to
  generate per-post entries once this happens, see §7. *(§2)*
