import { marked } from 'marked'

export { marked }

// ponytail: ~20-line frontmatter parser instead of gray-matter — flat key: value only
function parseMd(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw.trim() }
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { data, body: m[2].trim() }
}

const load = (glob) =>
  Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, raw]) => parseMd(raw))

const [profile] = load(
  import.meta.glob('/content/profile.md', { query: '?raw', import: 'default', eager: true })
)
const [skills] = load(
  import.meta.glob('/content/skills.md', { query: '?raw', import: 'default', eager: true })
)
const projects = load(
  import.meta.glob('/content/projects/*.md', { query: '?raw', import: 'default', eager: true })
)
const experience = load(
  import.meta.glob('/content/experience/*.md', { query: '?raw', import: 'default', eager: true })
).sort((a, b) => (+a.data.order || 99) - (+b.data.order || 99))

export const content = { profile, skills, projects, experience }

// skills.md body: "- group: X\n  items: a, b, c" blocks
export function parseSkillGroups(body) {
  const groups = []
  for (const block of body.split(/\n(?=- group:)/)) {
    const g = block.match(/group:\s*(.+)/)
    const it = block.match(/items:\s*(.+)/)
    if (g && it) groups.push({ group: g[1].trim(), items: it[1].split(',').map((s) => s.trim()) })
  }
  return groups
}
