import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content, parseSkillGroups, marked } from '../content.js'
import { firstVisit, magnetize, reduced, reveals, splitTitles, tilt } from '../interactions.js'
import { TLink } from '../transition.jsx'
import ProjectCard from '../components/ProjectCard.jsx'

const { data: p, body: aboutMd } = content.profile
const skillGroups = parseSkillGroups(content.skills.body)

const SplitTitle = ({ children }) => (
  <h2 className="section-title">
    {[...children].map((ch, i) => (
      <span key={i} className="char">{ch === ' ' ? ' ' : ch}</span>
    ))}
  </h2>
)

export default function Home() {
  const ref = useRef()

  useEffect(() => {
    ScrollTrigger.refresh()
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: firstVisit.value ? 2.6 : 0.5 })
        .from('.hero-title .line-inner', { yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out' })
        .from('.hero-eyebrow, .hero-tagline, .scroll-hint', { opacity: 0, y: 20, stagger: 0.08, duration: 0.6 }, '-=0.6')
      firstVisit.value = false

      gsap.to('.hero', {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 40%', scrub: true },
      })

      splitTitles(ref.current)
      reveals(ref.current)
    }, ref)
    magnetize(ref.current)
    tilt(ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={ref}>
      <section id="hero" className="section hero">
        <p className="hero-eyebrow">{p.role} &middot; {p.location}</p>
        <h1 className="hero-title">
          {p.name.split(' ').map((w) => (
            <span key={w} className="line"><span className="line-inner">{w}</span></span>
          ))}
        </h1>
        <p className="hero-tagline">{p.tagline}</p>
        <div className="scroll-hint" aria-hidden="true"><span></span>scroll</div>
      </section>

      <section id="about" className="section about">
        <SplitTitle>About</SplitTitle>
        <div className="about-body" data-reveal dangerouslySetInnerHTML={{ __html: marked.parse(aboutMd) }} />
      </section>

      <section id="skills" className="section skills">
        <SplitTitle>Skills</SplitTitle>
        <div className="skills-groups">
          {skillGroups.map((g) => (
            <div key={g.group} className="skill-group" data-reveal>
              <h3>{g.group}</h3>
              <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <a className="resume-btn" href="/Pranav_Gupta_Resume.pdf" download data-magnetic data-reveal>
          Resume &#8595;
        </a>
      </section>

      <section id="work" className="section work">
        <SplitTitle>Selected Work</SplitTitle>
        <div className="projects">
          {content.projects.slice(0, 4).map((proj, i) => (
            <ProjectCard key={proj.data.title} project={proj} index={i} />
          ))}
        </div>
        <TLink to="/projects" className="show-all" data-magnetic data-reveal>
          All projects &#8599;
        </TLink>
      </section>

      <section id="experience" className="section experience">
        <SplitTitle>Experience</SplitTitle>
        <div className="timeline">
          {content.experience.map(({ data: d, body }) => (
            <div key={d.company} className="timeline-item" data-reveal>
              <span className="timeline-period">{d.period}</span>
              <div>
                <h3>{d.role}</h3>
                <p className="timeline-company">{d.company}</p>
                <div className="timeline-body" dangerouslySetInnerHTML={{ __html: marked.parse(body) }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact">
        <p className="contact-eyebrow" data-reveal>Have an idea?</p>
        <a className="contact-cta" href={`mailto:${p.email}`} data-magnetic>Let&rsquo;s talk</a>
        <div className="contact-links">
          {[['GitHub', p.github], ['LinkedIn', p.linkedin], ['Email', `mailto:${p.email}`]].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener" data-magnetic>{label}</a>
          ))}
        </div>
        <footer className="footer">
          <span>&copy; {new Date().getFullYear()} {p.name}</span>
          <span>Built with React &middot; Three.js &middot; GSAP &middot; Markdown</span>
        </footer>
      </section>
    </main>
  )
}
