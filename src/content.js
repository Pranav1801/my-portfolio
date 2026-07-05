import { marked } from 'marked'

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

export function getContent() {
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
  return { profile, skills, projects, experience }
}

// skills.md body: "- group: X\n  items: a, b, c" blocks
function parseSkillGroups(body) {
  const groups = []
  for (const block of body.split(/\n(?=- group:)/)) {
    const g = block.match(/group:\s*(.+)/)
    const it = block.match(/items:\s*(.+)/)
    if (g && it) groups.push({ group: g[1].trim(), items: it[1].split(',').map((s) => s.trim()) })
  }
  return groups
}

export function renderContent(c) {
  const $ = (s) => document.querySelector(s)
  const { data: p, body: about } = c.profile

  document.title = `${p.name} — ${p.role}`
  $('.hero-eyebrow').textContent = `${p.role} · ${p.location}`
  $('.hero-title').innerHTML = p.name
    .split(' ')
    .map((w) => `<span class="line"><span class="line-inner">${w}</span></span>`)
    .join('')
  $('.hero-tagline').textContent = p.tagline
  $('.about-body').innerHTML = marked.parse(about)

  $('.skills-groups').innerHTML = parseSkillGroups(c.skills.body)
    .map(
      (g) => `
      <div class="skill-group" data-reveal>
        <h3>${g.group}</h3>
        <ul>${g.items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </div>`
    )
    .join('')

  $('.projects').innerHTML = c.projects
    .map(
      ({ data: d, body }, i) => `
      <a class="project-card${d.featured === 'true' ? ' featured' : ''}"
         ${d.link ? `href="${d.link}" target="_blank" rel="noopener"` : ''} data-reveal>
        <span class="project-index">${String(i + 1).padStart(2, '0')}</span>
        <div class="project-info">
          <h3 class="project-title">${d.title}</h3>
          ${d.company ? `<p class="project-company">For: ${d.company}</p>` : ''}
          <div class="project-desc">${marked.parse(body)}</div>
          <div class="project-tags">${(d.tags || '')
            .split(',')
            .map((t) => `<span>${t.trim()}</span>`)
            .join('')}</div>
        </div>
        <span class="project-year">${d.year || ''}</span>
        <span class="project-arrow" aria-hidden="true">&#8599;</span>
      </a>`
    )
    .join('')

  $('.timeline').innerHTML = c.experience
    .map(
      ({ data: d, body }) => `
      <div class="timeline-item" data-reveal>
        <span class="timeline-period">${d.period}</span>
        <div>
          <h3>${d.role}</h3>
          <p class="timeline-company">${d.company}</p>
          <div class="timeline-body">${marked.parse(body)}</div>
        </div>
      </div>`
    )
    .join('')

  const cta = $('.contact-cta')
  cta.href = `mailto:${p.email}`
  cta.textContent = "Let's talk"
  $('.contact-links').innerHTML = [
    ['GitHub', p.github],
    ['LinkedIn', p.linkedin],
    ['Email', `mailto:${p.email}`],
  ]
    .map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener" data-magnetic>${label}</a>`)
    .join('')
  $('.footer-name').textContent = `© ${new Date().getFullYear()} ${p.name}`
}
