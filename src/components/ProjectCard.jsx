import { marked } from '../content.js'

export default function ProjectCard({ project, index }) {
  const { data: d, body } = project
  const linkProps = d.link ? { href: d.link, target: '_blank', rel: 'noopener' } : {}
  return (
    <a className="project-card" {...linkProps} data-reveal>
      <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="project-info">
        <h3 className="project-title">{d.title}</h3>
        {d.company && <p className="project-company">For: {d.company}</p>}
        <div className="project-desc" dangerouslySetInnerHTML={{ __html: marked.parse(body) }} />
        <div className="project-tags">
          {(d.tags || '').split(',').map((t) => (
            <span key={t}>{t.trim()}</span>
          ))}
        </div>
      </div>
      <span className="project-year">{d.year || ''}</span>
      <span className="project-arrow" aria-hidden="true">&#8599;</span>
    </a>
  )
}
