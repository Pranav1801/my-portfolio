import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content } from '../content.js'
import { magnetize, reduced, tilt } from '../interactions.js'
import { TLink } from '../transition.jsx'
import ProjectCard from '../components/ProjectCard.jsx'

export default function Projects() {
  const ref = useRef()

  useEffect(() => {
    ScrollTrigger.refresh()
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        y: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, ref)
    magnetize(ref.current)
    tilt(ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={ref}>
      <section className="section work">
        <TLink to="/" className="back-link" data-magnetic>&#8592; Back</TLink>
        <h2 className="section-title">All Projects</h2>
        <div className="projects">
          {content.projects.map((proj, i) => (
            <ProjectCard key={proj.data.title} project={proj} index={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
