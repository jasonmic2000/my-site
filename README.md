# Jason Michael — Personal Portfolio

Source for my personal site: [dev.jasonjmichael.com](https://dev.jasonjmichael.com)

A minimal, lightweight portfolio built with the Next.js App Router — home page, work history, and a blog (in progress).

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Biome](https://biomejs.dev/) for linting and formatting
- MDX (`@next/mdx`) for content, parsed with `gray-matter` + `remark`
- [`next-themes`](https://github.com/pacocoursey/next-themes) for light/dark mode
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Check formatting, lint rules, and import order with Biome |
| `npm run lint:fix` | Same as above, applying safe fixes |
| `npm run format` | Format all files with Biome |

## Content

Work history entries live in `content/work/*.mdx`, one file per role, with frontmatter:

```md
---
company: "Company Name"
role: "Job Title"
startDate: "Month Year"
endDate: "Month Year"
initialDetails: "One-line summary shown on the homepage."
---

- Bullet points with more detail, shown on the /work page.
```

Entries are sorted by `startDate` automatically — no other registration needed.

## License

MIT — see [LICENSE](./LICENSE). Personal content (bio, work history text, avatar image) is not intended for reuse.
