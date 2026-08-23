# Codebase Notes

Living notes on the architecture of this repo, plus open recommendations and
audit findings from review sessions. Unlike a spec, this doc is expected to
go stale — check off items as they're done, and re-verify dependency
versions/audit results before acting on them since they're snapshots in time.

Last updated: 2026-08-13

---

## 1. Architecture & structure overview

### Tech stack
- **Framework**: Next.js 15.3.2 (App Router), React 19
- **Language**: TypeScript (strict mode), path alias `@/*` → repo root
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), `tailwind-merge` +
  `clsx` via a `cn()` helper, dark mode via the `class` strategy
- **Theming**: `next-themes` (system/light/dark, toggle lives in `Navbar`)
- **Content**: MDX + frontmatter (`@next/mdx`, `mdxRs: true`) parsed with
  `gray-matter`, body rendered via `remark`/`remark-html`
- **Fonts**: `next/font/google` (Geist Sans/Mono)
- **Icons**: `react-icons`
- **shadcn/ui is configured** (`components.json`, "new-york" style, slate
  base) but `components/ui/` doesn't exist yet — scaffolded, unused
- **Linting**: ESLint 9 flat config (`next/core-web-vitals`,
  `next/typescript`, `prettier`)
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
- [ ] `AnimatedArrow.tsx` is unused (no imports anywhere) — either wire it in
  or delete it.
- [ ] Decide on shadcn: either start using it (`npx shadcn add ...`) or strip
  `components.json` if the plan changed, so it doesn't look like an
  abandoned mid-setup.
- [ ] Blog route (`/blog`) is a static placeholder. When built out, it's a
  natural fit for the same MDX+frontmatter pattern proven in
  `content/work/`, but will likely want individual permalinks
  (`app/blog/[slug]/page.tsx`), unlike work entries which render as a
  single list.

---

## 3. Dependency audit (snapshot: 2026-08-13)

Re-run `npm outdated` / `npm audit` before acting on this — versions move.

### Outdated packages

| Package | Current | Latest | Bump type |
|---|---|---|---|
| next | 15.3.2 | 16.3.0 | major |
| eslint-config-next | 15.3.2 | 16.3.0 | major (locked to next) |
| @next/mdx | 15.3.3 | 16.3.0 | major (locked to next) |
| eslint | 9.27.0 | 10.8.1 | major |
| @vercel/speed-insights | 1.2.0 | 2.0.0 | major |
| typescript | 5.8.3 | 7.0.2 | major (see caveat below) |
| @types/node | 20.17.47 | 26.2.0 | major (tracks Node runtime version) |
| react / react-dom | 19.1.0 | 19.2.8 | minor |
| @types/react / @types/react-dom | 19.1.4 / 19.1.5 | 19.2.18 / 19.2.4 | minor |
| tailwindcss / @tailwindcss/postcss | 4.1.7 | 4.3.3 | minor |
| tailwind-merge | 3.3.0 | 3.6.0 | minor |
| tw-animate-css | 1.3.0 | 1.4.0 | minor |
| react-icons | 5.5.0 | 5.7.0 | minor |
| @eslint/eslintrc, eslint-config-prettier | — | — | patch |

### `npm audit` findings
13 advisories (2 critical, 8 high) as of the snapshot date. Most
(`tar`, `postcss`, `sharp`, `picomatch`, `minimatch`, `js-yaml`, `flatted`,
`ajv`, `brace-expansion`) are transitive deps of `next` itself or the
ESLint toolchain, not directly reachable through this site's own code — low
practical exposure for a static portfolio. However, several are fixed
simply by bumping Next past 15.5.23 (cache-confusion, SSRF-in-rewrites,
and other Next-specific CVEs), so this isn't pure noise — it's a concrete
reason to prioritize the Next patch bump below.

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

1. [ ] **Safe bulk bump** (patch/minor, low risk): `react`, `react-dom`,
   `@types/react`, `@types/react-dom`, `tailwindcss`,
   `@tailwindcss/postcss`, `tailwind-merge`, `tw-animate-css`,
   `react-icons`, `@eslint/eslintrc`, `eslint-config-prettier`. Run
   `npm update`, then `npm run build` + smoke test.
2. [ ] **Next.js 15.3.2 → 15.5.23** (stay within major 15 first) — picks up
   security fixes without v16 breaking changes. Verify build, dev server,
   and MDX rendering still work.
3. [ ] **Next.js 15 → 16 (major)** — bump `next`, `eslint-config-next`, and
   `@next/mdx` together (must stay in lockstep with Next's major version).
   Run `npx @next/codemod@canary upgrade latest` and check the official
   upgrade guide. Likely candidates for breakage in this repo: minimum
   Node version requirement, and whether `experimental.mdxRs` in
   `next.config.ts` has graduated out of experimental.
4. [ ] **ESLint 9 → 10 (major)** — do after Next 16, since
   `eslint-config-next@16` needs to declare ESLint 10 compatibility first.
   Flat config (`eslint.config.mjs`) should carry over with minimal changes.
5. [ ] **@vercel/speed-insights 1 → 2 (major)** — small surface area (just
   the `<SpeedInsights />` import in `app/layout.tsx`), check changelog for
   API changes first.
6. [ ] **TypeScript** — target `5.9.x` as "latest stable," do **not** jump to
   `7.0.2`. TS 7 is the new Go-based native-compiler rewrite, a different
   implementation rather than a version bump; ecosystem tooling (ESLint
   plugins, Next's type-checking) is still catching up. Revisit later.
7. [ ] **@types/node** — match to the Node version actually used in dev and
   on Vercel (check `node -v` locally and the Vercel project's Node
   setting) rather than blindly taking latest (26.x).

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
4. [ ] Update `package.json` scripts: replace `"lint": "next lint"` with
   `"lint": "biome check ."` (or split `biome lint .` / `biome format
   --write .`).
5. [ ] Remove `eslint`, `eslint-config-next` (if dropping Next-specific
   linting), `eslint-config-prettier`, `@eslint/eslintrc` from
   devDependencies; delete `eslint.config.mjs`.
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

### 🟠 Real bugs
- [x] ~~`Connect.tsx:25` — `target="__blank"` typo~~ **Fixed 2026-08-13** —
  corrected to `target="_blank"`.
  - [ ] **Still open**: `rel="noopener noreferrer"` is missing on the same
    links. This is the standard pairing with `target="_blank"` to prevent
    reverse-tabnabbing, and **is very likely why the Lighthouse Best
    Practices score isn't 100** (its "cross-origin destinations are
    unsafe" audit checks exactly this). The typo fix alone doesn't close
    this out.

### 🟡 Dead code
- [ ] `cn()` in `lib/utils.ts` (the `clsx` + `tailwind-merge` helper,
  shadcn boilerplate) is defined but never called anywhere in the codebase.
  Either start using it where hover/utility class strings are being
  hand-concatenated (see duplication note below) or remove it along with
  the `clsx`/`tailwind-merge` dependencies if shadcn adoption isn't
  happening.
- [ ] `AnimatedArrow.tsx` — unused component (already noted in §2).
- [ ] Leftover commented-out fields in `lib/consts.ts` (`NUM_POSTS_ON_HOMEPAGE`,
  `NUM_WORKS_ON_HOMEPAGE`, `NUM_PROJECTS_ON_HOMEPAGE`) and a commented
  `slug` field in `lib/utils.ts`'s `WorkEntryMeta`/reader — small, but same
  category as the design-draft comments: either use them or drop them.

### 🟡 Duplicated logic
- [ ] The hover/transition utility-class string
  `"transition duration-300 ease-in-out hover:text-black dark:hover:text-white"`
  (or a near-identical reordering) is hand-repeated **8 times** across
  `Navbar.tsx` (×3), `Connect.tsx` (×2), `Footer.tsx` (×1), and elsewhere.
  Good candidate to centralize as a constant (e.g. `lib/consts.ts` or a
  `cn()`-composed helper) or a small shared `<HoverLink>` wrapper, both to
  cut duplication and to make future style tweaks a one-line change instead
  of an 8-site find/replace.

### 🟡 Inconsistent patterns
- [ ] **Mixed import styles within the same file** — `app/layout.tsx` mixes
  the `@/*` path alias (`@/lib/consts`, `@/components/Footer`) with
  relative imports (`../styles/globals.css`, `../components/Navbar`) for
  conceptually identical imports. Every other file in the repo consistently
  uses the `@/*` alias — `layout.tsx` is the outlier.
- [ ] **Mixed export conventions** — `Navbar` and `Work` use `export default`
  (declared separately at the bottom of the file); `Connect` and `Footer`
  use inline named exports (`export const Connect = ...`). This forces
  inconsistent import syntax at call sites (`import Navbar from ...` vs
  `import { Footer } from ...`) for components that are otherwise
  structurally identical. Worth picking one convention (named exports are
  slightly preferable — easier to grep, no default-export ambiguity — but
  either is fine as long as it's consistent).
- [ ] **`"use client"` quote style** — double quotes in `Navbar.tsx`, single
  quotes in `app/providers.tsx`. Cosmetic, but exactly the kind of thing
  Biome/Prettier would auto-normalize (see §5).
- [ ] **List `key` strategy** — `Work.tsx` keys on the stable
  `entry.startDate`; `Navbar.tsx` keys nav items on array `index`. Low risk
  today since the nav list is static, but inconsistent with the
  stable-key pattern used elsewhere.

### 🟡 Structural/semantic HTML issue (also an accessibility finding, see §7)
- [ ] `components/Work.tsx` renders a **separate `<ul>` per work entry
  inside the `.map()`**, each containing exactly one `<li>`:
  ```tsx
  {workEntries.map((entry) => (
    <ul className="flex flex-col" key={entry.startDate}>
      <li>...</li>
    </ul>
  ))}
  ```
  This should be a single `<ul>` wrapping the `.map()`, with `<li>` as the
  repeated child — one list of N items, not N lists of one item each. The
  current structure is announced to screen readers as N separate
  single-item lists rather than one N-item list.

---

## 7. Build & performance analysis (snapshot: 2026-08-13)

### Bundle size (confirmed via `npm run build`, 2026-08-13, post-Navbar-fix)
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    5.58 kB         110 kB
├ ○ /_not-found                          1.02 kB         102 kB
├ ○ /blog                                  136 B         101 kB
└ ○ /work                                  220 B         105 kB
+ First Load JS shared by all             101 kB
  ├ chunks/4bd1b696-0630ddb528269b85.js  53.3 kB
  ├ chunks/684-d62f9fe6fc8970be.js         46 kB
  └ other shared chunks (total)          2.08 kB
```
All routes prerender as static content. ~101 kB shared First Load JS is
normal for a stock Next.js/React 19 app with no heavy client libraries —
nothing in the dependency list (react-icons, next-themes, remark, etc.) is
large enough to be a standout bundle concern. No action needed here beyond
what's already tracked in the framework version upgrade (§4).

### Likely causes of Lighthouse Accessibility not being 100
- [ ] **No `<h1>` anywhere in the site.** The homepage name heading uses
  `<h2>` (`app/page.tsx:14`), and section headings (`Work`, `Let's
  Connect`) are also `<h2>` — so the page has no top-level heading and no
  proper heading hierarchy. Fix: make the name heading an `<h1>` on the
  homepage (or use a per-page `<h1>` matching each route's purpose), keep
  section headings as `<h2>`.
- [ ] **Structural list issue** in `Work.tsx` — see §6, also an
  accessibility audit target (list semantics).
- [ ] **Low-contrast secondary text via opacity.** Secondary text uses
  `opacity-75` on top of already-muted colors (e.g. `text-sm opacity-75` in
  `Work.tsx` for role/dates, on top of body text colors `#3F3F46` on
  `#F4F4F5` light / `#D4D4D8` on `#18181B` dark from `layout.tsx`).
  Reducing opacity on text is one of the most common causes of Lighthouse's
  color-contrast audit failing, since it lightens effective contrast below
  WCAG AA (4.5:1) without being obvious visually. Recommend swapping
  `opacity-75` for a fixed, contrast-checked muted color instead (e.g. a
  specific zinc/slate shade verified against the background at 4.5:1+).

### Likely causes of Lighthouse Best Practices not being 100
- [ ] **Missing `rel="noopener noreferrer"`** on the `target="_blank"`
  social links in `Connect.tsx` — see §6. The `__blank` typo is fixed, but
  the `rel` attribute is still missing. This is the single most likely fix
  for a quick Best Practices win.
- [ ] **Running Next.js 15.3.2**, which has published CVEs fixed in later
  15.x/16.x releases (see §3 dependency audit) — Lighthouse's Best
  Practices category includes a "no known JS library vulnerabilities"
  audit, which can flag outdated framework versions. Another reason the
  Next patch bump (15.3.2 → 15.5.23+) in §4 is worth doing sooner rather
  than later.
- [ ] **`productionBrowserSourceMaps: true`** in `next.config.ts` ships full
  readable source maps to production. Not itself a Lighthouse audit
  failure, but it increases deployed output size and exposes original
  source in browser devtools with no corresponding benefit unless paired
  with an error-tracking service (e.g. Sentry) that consumes those maps
  server-side. Worth turning off unless there's a specific consumer for it.

### Image optimization
- [ ] **Avatar image is hotlinked from a third-party host**
  (`i.pinimg.com`, allowlisted via `remotePatterns` in `next.config.ts`)
  rather than self-hosted. This is the homepage's likely LCP (Largest
  Contentful Paint) element. Risks: no control over the image's lifecycle
  (Pinterest could rate-limit, block hotlinking, or take the image down),
  an extra third-party DNS/TLS round-trip on every page load, and no
  guaranteed cache headers from Pinterest's CDN. Recommend moving the image
  into `public/` (or importing it locally) and letting `next/image`
  optimize a first-party asset.
- [ ] **Missing `priority` on the avatar `<Image>`** (`app/page.tsx`). As
  the likely LCP element, it should be marked `priority` so Next.js
  preloads it instead of lazy-loading it — lazy-loading an above-the-fold
  LCP image is a direct Lighthouse performance hit.
- [ ] `public/` contains only `favicon.ico` (28K — larger than typical for
  a `.ico`) and no `apple-touch-icon`, `manifest.json`, or an Open Graph
  share image. `DEFAULT_METADATA` in `lib/consts.ts` doesn't set an `images`
  field for `openGraph`/`twitter`, so social shares of this site currently
  render without a preview image. Not a Lighthouse Accessibility/Best
  Practices item specifically, but worth fixing alongside the image work
  above since it's the same general area.
- [ ] No `app/robots.ts` or `app/sitemap.ts` — doesn't affect the two
  scores asked about here (that's the Lighthouse SEO category), but flagged
  since it's cheap to add once the metadata work above is being touched
  anyway.

---

## 8. Prioritized to-do list (as of 2026-08-13)

Synthesized from §§2–7. Ordered by urgency within each tier, not by effort.
Re-check off items directly here as they land — this list will drift from
the detailed sections above over time, so treat the sections as the source
of truth and this as a routing map into them.

### 🔒 Security
1. [ ] **Add `rel="noopener noreferrer"` to the `target="_blank"` links in
   `Connect.tsx`.** Reverse-tabnabbing gap — a linked-to page can currently
   use `window.opener` to redirect this site's tab. One-line fix per link,
   3 links total. *(§6, §7)*
2. [ ] **Bump Next.js past 15.5.23.** This is the one dependency issue with
   genuine runtime exposure — the current 15.3.2 has published CVEs
   including an SSRF via rewrites and unauthenticated disclosure of
   internal server-function endpoints. Everything else `npm audit` flags is
   transitive build-tooling noise (ESLint/typescript-eslint's own deps),
   not reachable through this site's runtime. *(§3, §4 step 2)*
3. [ ] **Turn off `productionBrowserSourceMaps`** (or keep it only if
   paired with a real source-map consumer like Sentry). Currently ships
   fully readable source to every visitor for no offsetting benefit. *(§7)*

### 🚧 Major — real bugs, broken/degraded behavior, accessibility failures
1. [x] ~~Missing `return` in `Navbar.tsx` (broke `next build` entirely)~~ —
   **fixed**.
2. [x] ~~`target="__blank"` typo~~ — **fixed** (the `rel` gap above is the
   remaining piece, tracked under Security).
3. [ ] **Add an `<h1>` to the homepage.** There is currently no `<h1>`
   anywhere on the site — a real accessibility/SEO defect, not just a
   Lighthouse nitpick. *(§7)*
4. [ ] **Fix `Work.tsx`'s list structure** — one `<ul>` wrapping the
   `.map()`, not one `<ul>` per entry. Currently announced to screen
   readers as N separate one-item lists. *(§6, §7)*
5. [ ] **Replace `opacity-75` secondary text with a fixed, contrast-checked
   color.** Likely cause of failed color-contrast audits (role/date text in
   `Work.tsx`, and anywhere else the same pattern is used). *(§7)*
6. [ ] **Self-host the avatar image and add `priority` to its `<Image>`.**
   Two compounding issues: it's likely the page's LCP element and is
   currently lazy-loaded instead of preloaded (direct performance hit), and
   it's hotlinked from `i.pinimg.com` with zero control over the asset's
   lifecycle — Pinterest changing or blocking hotlinking would silently
   break the homepage. Treating this as "major" rather than "nice to have"
   because of that reliability risk, not just the perf score. *(§7)*

### 🧹 Nice to have — cleanup, DX, future-proofing, non-urgent upgrades
- [ ] Safe dependency bulk-bump: `react`, `react-dom`, `@types/react`,
  `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`,
  `tailwind-merge`, `tw-animate-css`, `react-icons`, `@eslint/eslintrc`,
  `eslint-config-prettier`. *(§4 step 1)*
- [ ] Next.js 15 → 16 major upgrade (bundle with `eslint-config-next` and
  `@next/mdx`). *(§4 step 3)*
- [ ] ESLint 9 → 10 major upgrade, after Next 16. *(§4 step 4)*
- [ ] `@vercel/speed-insights` 1 → 2 major upgrade. *(§4 step 5)*
- [ ] TypeScript: stay on `5.9.x`, don't jump to the `7.x` native-compiler
  line yet. *(§4 step 6)*
- [ ] `@types/node`: match to actual Node runtime version, not latest.
  *(§4 step 7)*
- [ ] ESLint+Prettier → Biome migration. *(§5, full plan)*
- [ ] Remove dead code: unused `cn()` helper, unused `AnimatedArrow.tsx`,
  leftover commented-out fields in `lib/consts.ts` / `lib/utils.ts`. *(§6)*
- [ ] Extract the 8×-repeated hover/transition class string into a shared
  constant or helper. *(§6)*
- [ ] Standardize import style (`@/*` alias everywhere, including
  `layout.tsx`) and export convention (pick default or named, apply
  consistently). *(§6)*
- [ ] Decide on shadcn: adopt it or remove `components.json`. *(§2)*
- [ ] Add an Open Graph share image, `apple-touch-icon`, and
  `manifest.json`; consider `app/robots.ts`/`app/sitemap.ts`. *(§7)*
- [ ] Build out the `/blog` route with the same MDX pattern as `/work`,
  with per-post permalinks. *(§2)*
