# Pranav Gupta — Portfolio

Frontend-only portfolio. Three.js particle scene that morphs as you scroll,
GSAP ScrollTrigger storytelling, Lenis smooth scroll. All content lives in
Markdown — no code changes needed to update it.

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
| `content/projects/*.md` | One file per project (frontmatter: title, year, tags, link) |
| `content/experience/*.md` | One file per role, sorted by `order` |

Add/remove/edit `.md` files and rebuild — sections update automatically.
The experience files still contain placeholder text — replace with your real roles.

## Stack

Vite · Three.js · GSAP + ScrollTrigger · Lenis · marked
