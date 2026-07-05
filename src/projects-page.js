import './style.css'
import gsap from 'gsap'
import { getContent, projectsHTML } from './content.js'

document.querySelector('.projects').innerHTML = projectsHTML(getContent().projects)

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.from('.project-card', { y: 40, opacity: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out' })
}
