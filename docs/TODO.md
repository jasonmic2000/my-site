# Open items & health snapshot

Only unfinished work lives here; finished work is in `git log`. Check items off (or delete them) as they land.
Items marked **[needs input]** are blocked on information only the site owner has.

## Health snapshot (last verified 2026-10-07)
Re-verify with: `npm outdated`, `npm audit`, `npm run check`.
- Lint, typecheck, build: clean; every route prerenders statically (incl. feeds). CI green on Node 24 (`.github/workflows/ci.yml`).
- `npm outdated`: only `typescript` (5.9.3 → 7.x, waiting for 7.1) and `@types/node` (24.x → 26.x, waiting for Node 26).
- `npm audit`: 0 vulnerabilities. Dependabot runs weekly.
- Next 16.4.0, React 19.3, Biome 2.5.15, Node 24 (Vercel project setting must also be 24.x).
- Deployed on Vercel; security headers, `/blog`, `/feed.xml` and `@vercel/analytics` verified live.
- Lighthouse (2026-10-08, production build, mobile emulation, local): performance 97–99, accessibility 100, SEO 100, CLS 0 on home, work, blog and a post. Best practices 92 *locally only*: `/_vercel/*` analytics scripts 404 off Vercel; re-check against the live site.
- Playwright + axe suite (16 tests) passes locally and runs in CI.

## PARKED: design polish - typography, colour/type scale, interaction states (revisit after ALL other work)
Owner decision 2026-10-08: deliberately parked, together with the other design nitpicks, to avoid sinking time into them now. Do not start any of this until the rest of the roadmap is done; then take it slowly and do it as one pass so the pieces fit together.

### A. Interaction states (navbar and links)
Raised by the owner 2026-10-08: hover and "selected" are too subtle to tell what is active. Parked with the fonts because the hover/active language should be designed together with the type and colour scale.
- **Current behaviour:** every link uses `HOVER_TRANSITION_CLASS`, which only fades the text from zinc-700/300 to black/white. The active nav link (`aria-current="page"`) gets the same black/white, so hover, active and normal are almost indistinguishable. The theme toggle and Connect icons behave the same way.
- **Requirements:** state must not rely on colour alone (WCAG 1.4.1), so use a visible non-colour cue such as an underline; active, hover and keyboard focus must each look different and clear; one consistent interaction language across the navbar, logo, theme toggle, "See all work", Connect icons, footer and blog titles.
- **Proposal to review:** active = accent underline (2px, offset) and stronger weight; hover = neutral underline plus full-contrast text; toggle/icons = subtle background pill on hover. Add an e2e assertion for the active state.
- **Done when:** the owner signs off on screenshots in both themes (hover, active, focus), the axe checks stay green, and there is no layout shift when the active style applies.

### B. Typography and the colour/type scale
- **Fringing is a system issue, not a site bug.** Owner's setup: Windows 11, 1440p IPS monitor, 100% scaling; all text shows some colour fringing there, but not on an iPad Pro or phone. That points to Windows ClearType on this panel (try "Adjust ClearType text" in Windows). The site can only influence it through font choice: bundled fonts render more consistently than OS fonts, and thin strokes, light weights, hairline serifs and small italics fringe most.
- **Where serif is used today:** home hero role line (italic), the whole home bio, Work summaries and bullets, Connect copy, blog listing descriptions, post bodies, and the 404/error pages. Headings, labels, dates and nav are sans (Geist); code is Geist Mono. The serif came from the original homepage design and was later extended to the blog and error pages. `font-serif` is Tailwind's OS stack (Georgia on Windows).
- **Style cues for a "personal digital corner":** at most two families plus a mono; mono as a personality accent for dates, tags and the Ctrl+K hint; keep serif only where long reading happens (blog, maybe the bio); avoid weights below 400, hairline display serifs and small italics. Geist has no true italic (the browser fakes it), so sans-only designs should drop the italic role line.
- **Candidates already compared** (open `docs/design/font-pairings.html` in a browser on the owner's monitor; it loads Google Fonts and has a light/dark toggle): 1 today (Geist + Georgia); 2 Geist only + Geist Mono; **3 Geist + Newsreader for bio/posts (my recommendation)**; 4 Geist + Source Serif 4; 5 Atkinson Hyperlegible + JetBrains Mono; 6 Bricolage Grotesque headings; 7 Fraunces headings. No choice made yet.
- **Colour/type scale audit (same session):** the core palette is the original hex values (page `#f4f4f5`/`#18181b`, text `#3f3f46`/`#d4d4d8`), now `--background`/`--foreground` tokens. Changes since: muted text `zinc-600`/`zinc-400` instead of `opacity-75` (Aug 2026 contrast fix) and the `--accent` token (Oct 2026). Headings are pure black/white, body zinc-700/300. When resumed: write down the type and colour roles in one place, settle a small deliberate scale as tokens and apply it consistently, keep WCAG AA, and record the result in `DECISIONS.md`.
- **To resume:** pick a pairing, load it with `next/font` (bundled at build time, no external requests, ~20-40KB per family), apply it by role instead of one global serif, then review at the owner's real display in both themes and re-run the axe suite.

## Suggested order
1. ~~**Content refresh**~~ — done (home bio and work entries).
2. **Logo** — deferred by the owner (2026-10-08); do it later. It feeds the favicon, Apple icon, OG images, manifest and navbar, so do it before those.
3. ~~**Navbar theme toggle** and **home Posts section**~~ — done.
4. ~~**Essentials**~~ — done (404/error pages, skip link, focus styles, reduced motion, JSON-LD, theme-color, description, audit + automated checks).
5. **Background texture** — after reduced-motion handling exists, since it depends on it.
6. **Command palette (Ctrl/Cmd+K)** — after the theme toggle, motion toggle and Posts section, since its actions and results come from them.
7. **Blog v2**, then the **first real post** last, so it can describe the site as it actually ended up.
8. **Design polish** (parked section above: interaction states, typography, colour/type scale): last, deliberately, and as one pass. It may change how some earlier items look, which is fine.

## Content (owner-supplied)
- [x] ~~Home bio refreshed~~ (2026-10-08). Flow edits suggested by the assistant are pending the owner's decision.
- [x] ~~Work section refreshed~~ (2026-10-08): Deloitte USI, Jebi Softech and both Maxxton roles loaded; consecutive roles at one company are grouped under a single heading (`lib/work.ts`).
- [ ] Replace the placeholder `content/blog/hello-world.mdx` with a real first post (see Blog below).

## Features
- [ ] **Logo** (deferred, owner 2026-10-08). Design needed (**[needs input]**): wordmark/monogram or a tiny mascot. The current logo is the text `¯\_(ツ)_/¯` in `Navbar`. Deliver as SVG (single colour using `currentColor` so it follows the theme). Once chosen, update together: navbar, `public/favicon.ico` plus an SVG favicon, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/manifest.ts` icons.
- [ ] **Subtle background texture / grid, optionally with parallax.** Adds depth without hurting readability. Guardrails (these are requirements, not suggestions):
  - Purely decorative: a fixed, `aria-hidden`, `pointer-events-none` layer behind content; no content depends on it.
  - CSS only (gradients/`background-image`), no image downloads; separate light and dark variants.
  - Very low contrast; verify text still meets WCAG AA (4.5:1) against the worst-case pixel of the pattern, in both themes.
  - Motion is the risk. Keep parallax tiny (a few px to ~20px total), slow and scroll-linked only (no autoplay/looping), transform-only so it doesn't cause layout or paint work. Prefer CSS scroll-driven animation (`animation-timeline: scroll()`) over JS scroll listeners where supported.
  - **Off by default under `prefers-reduced-motion: reduce`**, and also provide a visible user toggle (persisted in `localStorage`, applied before paint like the theme) so anyone can disable the motion, or the whole texture.
  - Verify on mobile/low-end devices; consider disabling parallax on touch/small screens.
  - Try a static texture first; add parallax only if it still feels flat.

- [ ] **Command palette, opened with Ctrl+K / Cmd+K.**
  - **What it offers:** navigate (Home, Work, Blog, individual posts, and later tag pages); actions (toggle theme, toggle background motion, copy email, open GitHub/LinkedIn/X, open the RSS feed). Typing filters results; Enter runs the highlighted one.
  - **Discoverability:** a visible trigger button in the navbar showing the shortcut hint (`⌘K` on macOS, `Ctrl K` elsewhere), since touch devices have no keyboard shortcut and most visitors won't guess it. Also works from the keyboard (`/` is a common secondary shortcut).
  - **Accessibility (requirements):** modal dialog with focus trapped inside and restored to the trigger on close; Esc closes; combobox/listbox semantics (`aria-activedescendant`, `aria-selected`, live result count for screen readers); fully usable without a mouse; visible focus; no animation under `prefers-reduced-motion`. Don't intercept the shortcut while typing in a text field.
  - **Stay static and light:** build the post/page index at build time on the server and pass it as props to a client component; lazy-load that component (dynamic import on first open or idle) so it doesn't add to first-load JS. Simple substring/fuzzy filter is enough at this scale. No search service.
  - **Decision to make when starting:** hand-roll it on the native `<dialog>` element (zero dependencies, good built-in focus handling) vs the `cmdk` library (less code, but a dependency plus Radix pieces). Default: native `<dialog>` unless `cmdk` turns out to save real effort.
  - **Depends on:** theme toggle and motion toggle (actions), shared post list/`getAllPosts()` (results), the logo/mascot (empty state, optional), and ideally the Playwright smoke test (open, filter, run an action).

## Blog v2
All of these are in [BLOG-PLAN.md](BLOG-PLAN.md) (details and rationale there).
- [ ] Per-post Open Graph images (`app/blog/[slug]/opengraph-image.tsx`)
- [ ] Reading time
- [ ] Table of contents (heading ids already exist via `rehype-slug`)
- [ ] Tag pages
- [ ] Code block niceties: copy button, optional filename/title, line highlighting (supported by `rehype-pretty-code`)
- [ ] Full-content feeds (currently excerpt + link)
- [ ] **First real post**: a detailed write-up of this site's tech stack and design decisions, including *why* each choice was made. Source material already exists in `docs/DECISIONS.md` and `docs/ARCHITECTURE.md` (Biome vs ESLint, static-only/no Cache Components, MDX pipeline choice, no CSP trade-off, Node/TypeScript pinning, accessibility fixes, the scrollbar-gutter layout-shift bug, etc.). Write it last so it reflects the finished site. Good candidates for live `<Callout>`/demo components.

## Nice-to-haves (suggested)
Optional polish; none are required.
- [ ] **Page transitions** with React `<ViewTransition>` (Next 16 guide: `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`). Subtle cross-fade between routes; also respects reduced motion.
- [ ] **Reading progress bar** on post pages (thin accent line, CSS scroll-driven).
- [ ] **Heading anchor affordance** (a `#` revealed on hover) and copy-link behaviour; headings already wrap in links.
- [ ] **Accent polish**: `::selection` colour in the rose accent, `text-wrap: balance` on headings and `text-wrap: pretty` on prose.
- [ ] **"Colophon"/"Uses" page or footer note**: link to the source repo, show the build's commit/date, link to the tech-stack post.
- [ ] **Print stylesheet** for `/work` so it prints as a clean one-page résumé; optionally a downloadable PDF résumé link.
- [ ] **Easter eggs** tied to the logo/mascot (keyboard shortcut for theme, hidden animation).
- [ ] **Email address obfuscation** in `Connect` (the address is plain text in the HTML and scrapeable).
- [ ] **Projects page** (the old `PROJECTS` constant was removed as unused; the bio mentions self-hosted experiments and a home server).
- [ ] **"Currently playing/reading" widget** (the bio mentions games and board games). Needs an external API; would require ISR or client fetch, so weigh against the fully-static rule first.
- [ ] **Contact form — considered and deferred (2026-10-07).** Needs a server action/route handler, an email service (e.g. Resend) with secrets, spam protection (honeypot/Turnstile, rate limiting), server-side validation, accessible error handling and sender-domain deliverability setup (~half a day plus ongoing upkeep). `Connect` already has email and socials, which is the norm for developer portfolios. It would also invalidate the "no user input" premise behind the no-CSP decision (`docs/DECISIONS.md`), so revisit that if built. Cheaper alternatives first: email obfuscation, a "copy email" palette action, or a third-party form service (Formspree/Web3Forms) if a form is wanted later. Revisit if inbound contact demand shows up or the plain-text address becomes a spam problem.
- [ ] Search, comments and a newsletter are deliberately **not** suggested: they add runtime cost or third-party scripts for little value at this scale.

## Waiting on others
- [ ] TypeScript 7.1 (stable programmatic API); then bump `typescript` and re-test the `next` tsconfig plugin in the editor.
- [ ] Node 26: after it enters LTS (2026-10-28) *and* Vercel supports it; change `engines`, `.nvmrc`, the Vercel setting and `@types/node` together.
- [ ] Vercel project Node.js setting → 24.x (owner action, removes the override warning).
