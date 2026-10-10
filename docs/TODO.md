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
- **Already in place:** only the Connect icons have a press-in squish (`ICON_PRESS_CLASS`, `active:scale-90`); fold it into the final interaction language and decide whether the navbar links, theme toggle and menu trigger get it too.
- **Proposal to review:** active = accent underline (2px, offset) and stronger weight; hover = neutral underline plus full-contrast text; toggle/icons = subtle background pill on hover. Add an e2e assertion for the active state.
- **Done when:** the owner signs off on screenshots in both themes (hover, active, focus), the axe checks stay green, and there is no layout shift when the active style applies.

### B. Typography and the colour/type scale
- **Fringing is a system issue, not a site bug.** Owner's setup: Windows 11, 1440p IPS monitor, 100% scaling; all text shows some colour fringing there, but not on an iPad Pro or phone. That points to Windows ClearType on this panel (try "Adjust ClearType text" in Windows). The site can only influence it through font choice: bundled fonts render more consistently than OS fonts, and thin strokes, light weights, hairline serifs and small italics fringe most.
- **Where serif is used today:** home hero role line (italic), the whole home bio, Work summaries and bullets, Connect copy, blog listing descriptions, post bodies, and the 404/error pages. Headings, labels, dates and nav are sans (Geist); code is Geist Mono. The serif came from the original homepage design and was later extended to the blog and error pages. `font-serif` is Tailwind's OS stack (Georgia on Windows).
- **Style cues for a "personal digital corner":** at most two families plus a mono; mono as a personality accent for dates, tags and the Ctrl+K hint; keep serif only where long reading happens (blog, maybe the bio); avoid weights below 400, hairline display serifs and small italics. Geist has no true italic (the browser fakes it), so sans-only designs should drop the italic role line.
- **Candidates already compared** (open `docs/design/font-pairings.html` in a browser on the owner's monitor; it loads Google Fonts and has a light/dark toggle): 1 today (Geist + Georgia); 2 Geist only + Geist Mono; **3 Geist + Newsreader for bio/posts (my recommendation)**; 4 Geist + Source Serif 4; 5 Atkinson Hyperlegible + JetBrains Mono; 6 Bricolage Grotesque headings; 7 Fraunces headings. No choice made yet.
- **Colour/type scale audit (same session):** the core palette is the original hex values (page `#f4f4f5`/`#18181b`, text `#3f3f46`/`#d4d4d8`), now `--background`/`--foreground` tokens. Changes since: muted text `zinc-600`/`zinc-400` instead of `opacity-75` (Aug 2026 contrast fix) and the `--accent` token (Oct 2026). Headings are pure black/white, body zinc-700/300. When resumed: write down the type and colour roles in one place, settle a small deliberate scale as tokens and apply it consistently, keep WCAG AA, and record the result in `DECISIONS.md`.
- **To resume:** pick a pairing, load it with `next/font` (bundled at build time, no external requests, ~20-40KB per family), apply it by role instead of one global serif, then review at the owner's real display in both themes and re-run the axe suite.

### C. Background texture, palette and notebook alignment
Owner decision 2026-10-10: **parked with the fonts**; do not spend time here until the rest of the roadmap is done. The owner will keep revisiting the comparison pages in `docs/design/` (`background-options.html`, `-v2.html`, `-v3.html`) and will say when decided. Open decisions: palette (zinc / stone / cream / ivory / custom hex), dots or fine grid, text knockout yes/no and when. Already done: light accent deepened to `#e5456a`; 24px unit chosen. Subtle background texture / grid, optionally with parallax. Adds depth without hurting readability. Guardrails (these are requirements, not suggestions):
  - **Comparison page built (2026-10-10):** `docs/design/background-options.html` (open in a browser; URL hash options `#dark`, `#k=1.5`, `#ink`). Six options: none, fine grid, fine grid fading out, dot grid, graph paper, paper grain; strength slider; live WCAG numbers per option. **Owner has not chosen yet.**
  - **Key finding:** in light mode the accent (`#eb506d`) has only 0.24 of headroom over 3:1, so *dark* lines darker than about 3.8% opacity (less where lines cross) push it below AA; at just 2% the grid already fails at crossings (2.99:1) and graph paper fails (2.77:1). Dark mode has ample room (grid/dots pass at 7.5%). Light-mode fix: **white "highlight" lines** (lighter than the page; can never lower contrast, accent stays 3.24:1). Graph paper's heavier overlapping lines fail muted text in dark above about 7%; paper grain is nearly invisible at contrast-safe strengths.
  - **Owner narrowed it (2026-10-10):** dot grid or fine grid, **no fade**. Light accent deepened to `#e5456a` (done). Unit is **24px** (matches the 24px body line height) so later notebook alignment needs no rework. Second comparison page: `docs/design/background-options-v2.html` (A dots + deeper accent, B fine grid + deeper accent, C fine grid + today's accent with white highlight lines; light and dark shown together, strength slider, optional accent margin line). **Waiting on the owner's pick among A/B/C.** Safe light-mode strengths with the deeper accent: dots up to about 8% per mark, grid up to about 4% per line (crossings overlap).
  - **Round 3 (2026-10-10), owner leans dot grid but has not committed.** New ideas to evaluate: (1) **knock out text blocks** (plain page colour behind every text block, hiding the pattern) as on a reference site the owner found; (2) **warmer whites** to cohere with the rose accent, in both modes. Page: `docs/design/background-options-v3.html` (hash options `#grid`, `#noko`, `#unsnap`, `#margin`, `#k=1.4`; five palettes incl. a custom-hex column; light and dark together).
  - **Reference site, measured from the owner's screenshot:** cream `#f3f0e6`, 1px solid tan lines `#e7e2d1`, **24px pitch** (same unit we chose), text blocks knocked out with the plain cream, navy ink `#1c2b3a`, teal accent `#2f6f66`.
  - **Palettes tried:** zinc (today, `#f4f4f5`/`#18181b`), stone (`#f5f5f4`/`#1c1917`, barely warm), cream (`#f3f0e6`/`#1b1915`), ivory (`#f1eee9`/`#191816`, soft greyer warm white; an interpretation, retailers only say "white, matte" for the Edifier MR3), custom.
  - **Findings:** warm backgrounds are slightly darker, so the accent has less headroom (accent on the plain page: zinc 3.54, cream 3.42, ivory 3.37 with `#e5456a`; with the old `#eb506d` ivory is only 3.08). So the deeper `#e5456a` is needed with any warm palette. Knockout removes the text-contrast constraint (text sits on the plain colour) but focus rings and borders still cross the pattern: with `#e5456a`, max safe per-mark alpha on cream is dots 6.7% / grid 3.4%, on ivory dots 5.7% / grid 2.9%. Switching palettes means migrating the cool-grey utilities (35 `zinc-*` usages in 8 files, plus the `--color-zinc-*` tokens in `styles/globals.css`).
  - **Knockout caveats:** every text element needs the knockout (a global rule on text elements inside `main`, plus code blocks, tables, images, hover states); without snapped rows the cut edges land mid-cell and look patchy, with snapped rows they follow the grid lines. The pattern is then visible mainly in the gaps and margins (more "frame" than "texture").
  - **Notebook alignment (text snapped to the 24px rows) is deferred to the final design polish**, after typography is settled. It is a vertical-rhythm job, not a background job: measured 2026-10-10, only 3 of 17 blocks on home (6 of 36 on /work, 2 of 10 in a post) sit on 24px rows. Needs: small text line height 20px to 24px, paragraph gaps 16px to 24px, section gaps 80px/40px/32px to multiples of 24, avatar 128px to 120/144px, post headings/code/tables/callout padding on the unit, and optionally the column 648px with 24px padding so vertical lines meet the text edge. Add an e2e "rhythm" test (every text block on a 24px row). Optional extra: thin accent margin line.
  - Purely decorative: a fixed, `aria-hidden`, `pointer-events-none` layer behind content; no content depends on it.
  - CSS only (gradients/`background-image`), no image downloads; separate light and dark variants.
  - Very low contrast; verify text still meets WCAG AA (4.5:1) against the worst-case pixel of the pattern, in both themes.
  - Motion is the risk. Keep parallax tiny (a few px to ~20px total), slow and scroll-linked only (no autoplay/looping), transform-only so it doesn't cause layout or paint work. Prefer CSS scroll-driven animation (`animation-timeline: scroll()`) over JS scroll listeners where supported.
  - **Off by default under `prefers-reduced-motion: reduce`**, and also provide a visible user toggle (persisted in `localStorage`, applied before paint like the theme) so anyone can disable the motion, or the whole texture.
  - Verify on mobile/low-end devices; consider disabling parallax on touch/small screens.
  - Try a static texture first; add parallax only if it still feels flat.


## Suggested order
1. ~~**Content refresh**~~ — done (home bio and work entries).
2. **Logo** — deferred by the owner (2026-10-08); do it later. It feeds the favicon, Apple icon, OG images, manifest and navbar, so do it before those.
3. ~~**Navbar theme toggle** and **home Posts section**~~ — done.
4. ~~**Essentials**~~ — done (404/error pages, skip link, focus styles, reduced motion, JSON-LD, theme-color, description, audit + automated checks).
5. ~~**Command palette (Ctrl/Cmd+K)**~~ — done.
6. **Blog v2**, then the **first real post** last, so it can describe the site as it actually ended up.
7. **Design polish** (parked section above: interaction states, typography, colour/type scale, background texture and palette): last, deliberately, and as one pass. It may change how some earlier items look, which is fine.

## Content (owner-supplied)
- [x] ~~Home bio refreshed~~ (2026-10-08). Flow edits suggested by the assistant are pending the owner's decision.
- [x] ~~Work section refreshed~~ (2026-10-08): Deloitte USI, Jebi Softech and both Maxxton roles loaded; consecutive roles at one company are grouped under a single heading (`lib/work.ts`).
- [ ] Replace the placeholder `content/blog/hello-world.mdx` with a real first post (see Blog below).

## Features
- [ ] **Logo** (deferred, owner 2026-10-08). Design needed (**[needs input]**): wordmark/monogram or a tiny mascot. The current logo is the text `¯\_(ツ)_/¯` in `Navbar`. Deliver as SVG (single colour using `currentColor` so it follows the theme). Once chosen, update together: navbar, `public/favicon.ico` plus an SVG favicon, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/manifest.ts` icons.
- [x] ~~**Command menu (Ctrl/Cmd+K)**~~ done 2026-10-10 (see ARCHITECTURE.md). Follow-ups: use the GitHub noreply address as the git author email for new commits (owner choice, see DECISIONS.md); add tag pages as results once they exist, a background/motion toggle action once the parked background exists, a bio/recent-work search, and softening the rose focus ring on the search field when the interaction states are polished.

## Blog v2 (done 2026-10-10 except the items below)
Shipped: per-post Open Graph images, reading time, collapsible table of contents (3+ headings), code-block copy button / titles / line highlighting / line numbers, tag pages (also in the sitemap and the Ctrl+K menu). See ARCHITECTURE.md (Blog).
- [ ] **First real post**: a detailed write-up of this site's tech stack and design decisions, including *why* each choice was made. Source material already exists in `docs/DECISIONS.md` and `docs/ARCHITECTURE.md` (Biome vs ESLint, static-only/no Cache Components, MDX pipeline choice, no CSP trade-off, Node/TypeScript pinning, accessibility fixes, the scrollbar-gutter layout-shift bug, etc.). Write it last so it reflects the finished site. Good candidates for live `<Callout>`/demo components.
- [ ] Full-content feeds (currently excerpt + link): deferred. It needs MDX rendered to static HTML for the feed (server rendering of the evaluated post), which is a lot of machinery for little benefit; revisit only if readers ask.
- [ ] Share images use the default regular-weight font; load a bold font (e.g. a local Geist file) in the `ImageResponse` for bolder titles. Cosmetic.
- [ ] Optional: a `/blog/tags` index page, tag descriptions, related posts.

## Nice-to-haves (suggested)
Optional polish; none are required.
- [ ] **Page transitions** with React `<ViewTransition>` (Next 16 guide: `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`). Subtle cross-fade between routes; also respects reduced motion.
- [ ] **Reading progress bar** on post pages (thin accent line, CSS scroll-driven).
- [ ] **Heading anchor affordance** (a `#` revealed on hover) and copy-link behaviour; headings already wrap in links.
- [ ] **Accent polish**: `::selection` colour in the rose accent, `text-wrap: balance` on headings and `text-wrap: pretty` on prose.
- [ ] **"Colophon"/"Uses" page or footer note**: link to the source repo, show the build's commit/date, link to the tech-stack post.
- [ ] **Print stylesheet** for `/work` so it prints as a clean one-page résumé; optionally a downloadable PDF résumé link.
- [ ] **Easter eggs** tied to the logo/mascot (keyboard shortcut for theme, hidden animation).
- [ ] **Projects page** (the old `PROJECTS` constant was removed as unused; the bio mentions self-hosted experiments and a home server).
- [ ] **"Currently playing/reading" widget** (the bio mentions games and board games). Needs an external API; would require ISR or client fetch, so weigh against the fully-static rule first.
- [ ] **Contact form — considered and deferred (2026-10-07).** Needs a server action/route handler, an email service (e.g. Resend) with secrets, spam protection (honeypot/Turnstile, rate limiting), server-side validation, accessible error handling and sender-domain deliverability setup (~half a day plus ongoing upkeep). `Connect` already has email and socials, which is the norm for developer portfolios. It would also invalidate the "no user input" premise behind the no-CSP decision (`docs/DECISIONS.md`), so revisit that if built. Cheaper alternatives first: email obfuscation, a "copy email" palette action, or a third-party form service (Formspree/Web3Forms) if a form is wanted later. Revisit if inbound contact demand shows up or the plain-text address becomes a spam problem.
- [ ] Search, comments and a newsletter are deliberately **not** suggested: they add runtime cost or third-party scripts for little value at this scale.

## Waiting on others
- [ ] TypeScript 7.1 (stable programmatic API); then bump `typescript` and re-test the `next` tsconfig plugin in the editor.
- [ ] Node 26: after it enters LTS (2026-10-28) *and* Vercel supports it; change `engines`, `.nvmrc`, the Vercel setting and `@types/node` together.
- [ ] Vercel project Node.js setting → 24.x (owner action, removes the override warning).
