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

## Suggested order
1. **Content refresh** (home copy + work entries) — unblocks everything that shows real content. Needs owner input.
2. **Logo** — feeds the favicon, Apple icon, OG images, manifest and navbar, so do it before those.
3. **Navbar theme toggle** and **home Posts section** — small, self-contained.
4. **Essentials** — 404/error pages, skip link, focus styles and the shared reduced-motion rule are done; JSON-LD, `theme-color` and the audit remain.
5. **Background texture** — after reduced-motion handling exists, since it depends on it.
6. **Command palette (Ctrl/Cmd+K)** — after the theme toggle, motion toggle and Posts section, since its actions and results come from them.
7. **Blog v2**, then the **first real post** last, so it can describe the site as it actually ended up.

## Content (owner-supplied)
- [ ] **[needs input] Refresh the home page copy** (`app/page.tsx`). The bio is over a year old and predates two job changes. Needed: the new bio text (or key points to rework), current title/employer for the hero line (the hero already derives "role at company" from the latest work entry, so that part follows the work data).
- [ ] **[needs input] Work section: add two new entries and update the existing Maxxton entries.** Per entry, `content/work/<slug>.mdx` needs `company`, `role`, `startDate` (ISO `YYYY-MM`), `endDate` (ISO `YYYY-MM`, omit for the current role), `initialDetails` (optional blurb) and bullet points. Also confirm the end date of the current Maxxton entry (it is currently `Current`/no end date) and whether Maxxton should stay as two entries. Frontmatter is validated at build time, so mistakes fail the build with the file name. Note the home page shows only the most recent entry.
- [ ] Replace the placeholder `content/blog/hello-world.mdx` with a real first post (see Blog below).

## Features
- [ ] **Home: "Posts" section**, mirroring the `Work` section on the home page.
  - Show the 2 most recent posts (title, date, description) in the same format as the `/blog` list, with a "See all posts" link like Work's "See all work".
  - Extract the list item from `app/blog/page.tsx` into a shared component (e.g. `components/PostList.tsx`) used by both, instead of duplicating markup. Home renders it with `h2`; `/blog` keeps its `h1`.
  - Reuse `getAllPosts()` (drafts already excluded in production). Render nothing if there are no posts.
- [ ] **Navbar theme toggle: swap icons per theme, with a small SVG transition.**
  - Today it always shows the moon (`FiMoon`). Show a sun in dark mode (action: switch to light) and a moon in light mode.
  - Render both icons and switch with CSS `dark:` variants instead of reading `resolvedTheme` in JS. That avoids a hydration mismatch/flash, since the theme class is set before paint.
  - Animate with a CSS-driven SVG morph/rotate (sun rays scale out, moon mask slides in); ~200–300ms. Must be disabled under `prefers-reduced-motion`.
  - Make the `aria-label` reflect the action ("Switch to light theme"). Consider a third "system" state, since the provider already supports it.
- [ ] **Logo.** Design needed (**[needs input]**): wordmark/monogram or a tiny mascot. The current logo is the text `¯\_(ツ)_/¯` in `Navbar`. Deliver as SVG (single colour using `currentColor` so it follows the theme). Once chosen, update together: navbar, `public/favicon.ico` plus an SVG favicon, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/manifest.ts` icons.
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

## Essentials (suggested)
Things most polished personal sites have and this one currently lacks.
- [ ] **Structured data (JSON-LD)**: `Person` on the home page, `BlogPosting` on posts, per the Next JSON-LD guide (`node_modules/next/dist/docs/01-app/02-guides/json-ld.md`).
- [ ] **`theme-color` per colour scheme** via the `viewport` export (browser UI colour follows light/dark).
- [ ] **Accessibility/performance re-audit**: re-run Lighthouse (never re-run since the h1/contrast/metadata fixes) and add an automated check (e.g. axe via Playwright) to CI so regressions are caught. A small Playwright smoke test (routes load, feed valid, theme toggle works) is the natural first test suite.
- [ ] Update `DEFAULT_METADATA.description` ("Jason Michael's Website") to something descriptive; it is the default meta/OG description.

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
