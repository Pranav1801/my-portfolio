# Pranav Gupta — Portfolio

Frontend-only React portfolio. Three.js particle scene that morphs as you
scroll, GSAP ScrollTrigger storytelling, Lenis smooth scroll, and animated
page transitions between routes. All content lives in Markdown — no code
changes needed to update it.

## Run

```bash
npm install
npm run dev       # local dev at http://localhost:5173
npm run build     # static output in dist/ — deploy anywhere (Pages, Netlify, Vercel)
```

## Editing content

Everything under `content/` is the source of truth:

| File | Controls |
|---|---|
| `content/profile.md` | Name, role, tagline, links, About text |
| `content/skills.md` | Skill groups (`- group:` / `items:` blocks) |
| `content/projects/*.md` | One file per project (frontmatter: title, year, tags, link, company — link and company are optional; company renders as "For: …") |
| `content/experience/*.md` | One file per role, sorted by `order` |

Add/remove/edit `.md` files and rebuild — sections update automatically.
The home page shows the first 4 projects (file-name order); `/projects`
lists them all. The Resume button serves `public/Pranav_Gupta_Resume.pdf` —
replace that file to update it.

Note: it's a single-page app (React Router). When deploying to a static
host, configure a fallback to `index.html` so deep links like `/projects`
work (Netlify/Vercel do this automatically; GitHub Pages needs a 404.html
copy of index.html).

## Stack

Vite · React · React Router · Three.js · GSAP + ScrollTrigger · Lenis · marked
