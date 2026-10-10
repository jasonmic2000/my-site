# Checkpoint - start here when resuming

Written 2026-10-10 at the end of a long working session, so the next session does not depend on remembered
context. Read this first, then `docs/TODO.md` (open items), `docs/DECISIONS.md` (do not re-litigate) and
`docs/ARCHITECTURE.md` (how it works). `CLAUDE.md` loads automatically and points here.

## State at this checkpoint
- `main` was pushed and in sync with `origin/main` at `b41078b` (this checkpoint's own commit may be ahead;
  run `git status -sb` and `git log --oneline -5`). Working tree clean. Locally lint, typecheck, build and
  50 Playwright/axe tests pass; CI also runs `npm audit`. Deployed on Vercel.
- Stack: Next.js 16.4, React 19.3, Tailwind v4, Biome, Node 24, TypeScript 5.9 (held for 7.1).
  `npm outdated` shows only `typescript` and `@types/node`, both held on purpose.

## Done so far (all in `git log`)
Security and dependency work (RCE patch, 0 audit findings, Node 24), Biome rules, CI plus Dependabot,
MDX blog (listing, posts, RSS/Atom/JSON feeds, JSON-LD, sitemap, analytics) and blog v2 (tag pages, reading
time, per-post OG images, table of contents, code blocks with a hover-reveal copy button, titles and line
highlighting; plain filled block, unframed icon, 1.5rem spacing, see DECISIONS.md), Ctrl/Cmd+K command menu,
email behind an envelope button, accessibility baseline (skip
link, focus styles, reduced motion, custom 404/error pages), single accent token, theme toggle with
moon/sun transition, home "Posts" section, Playwright + axe suite, and the content refresh (grouped
work history, bio, Connect copy).

## Next, in this order
1. **The first real blog post** (tech stack and design decisions; replace the `hello-world` placeholder). Blog v2 is done.
2. Logo (deferred by the owner).
3. **Parked design polish, done last as one pass** (owner decision 2026-10-10): interaction states, typography,
   colour/type scale, and the **background texture** (palette, dots vs grid, knockout, notebook alignment). Comparison
   pages: `docs/design/font-pairings.html`, `background-options.html`, `-v2.html`, `-v3.html`. The owner keeps
   revisiting these and will say when decided; do not push for a decision. Already applied: light accent `#e5456a`.
   Done since the last checkpoint: Ctrl/Cmd+K menu, email hidden behind an envelope button with a popup, blog v2.

## Waiting on the owner
- Set the Vercel project's Node.js Version to 24.x (unconfirmed; removes the override warning).
- The first real blog post, and a logo direction (later).
- The design-polish decisions (fonts, palette, dots vs grid, knockout), whenever they are ready.
- Worth a look after each deploy: work history layout, bio, theme toggle in both themes.

## How we work (owner preferences)
- Commit each self-contained piece with a Conventional Commit and the Co-Authored-By trailer; **push only
  when the owner asks in that moment**. Keep commits atomic.
- Verify before committing: `npm run check`, `npm run test:e2e` for UI changes, and look at screenshots
  for anything visual. Report mistakes plainly (including ones caught before committing).
- For design choices, build a local comparison page and let the owner pick; do not decide for them.
- Content is the owner's voice: apply their text, normalise punctuation, then offer feedback separately.
- Copy rule: plain hyphens only, no en/em dashes, curly apostrophes (see DECISIONS.md).
- The owner is on Windows 11, 1440p IPS at 100% scaling; text fringing there is ClearType, not the site.

## Tooling recipes (Windows)
- **Visual check:** `npm run build`, then `npx next start -p <port>` (background), then PowerShell:
  `& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu
  --hide-scrollbars --window-size=W,H --virtual-time-budget=8000 --screenshot=<file.png> <url>`.
  It sometimes does not write the file: retry up to 3 times. Headless Edge follows the OS colour scheme;
  to see light mode temporarily set `defaultTheme="light"` in `app/providers.tsx`, then `git checkout` it.
- **Measuring layout:** a throwaway Node script that does `require("@playwright/test")` with
  `chromium.launch({ channel: "msedge" })`, run from the repo root, deleted afterwards.
- **Stop servers by port**, never by killing all Node processes:
  `Get-NetTCPConnection -LocalPort <n> -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`.
- **Stale types** after deleting a route: `rm -rf .next`.
- **Lighthouse locally:** start Edge with `--remote-debugging-port=9333`, then
  `npx lighthouse <url> --port=9333`. Best-practices scores ~92 locally only because `/_vercel/*` scripts 404.
- **Pitfalls:** scripted edits on Windows must write with `newline="\n"` (CRLF breaks Biome); never run
  `biome check --write --unsafe` on a tree with parse errors; Biome reflows long JSX text so exact
  one-line string matches fail (rewrite the whole block instead). See DECISIONS.md for details.
- Throwaway files (screenshots, scratch pages) live in the session scratchpad and are not kept; anything
  worth keeping goes under `docs/` (for example `docs/design/`).
