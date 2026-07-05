import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { initScene } from './scene.js'
import { initCursor, magnetize, reduced } from './interactions.js'
import { TransitionContext, TLink } from './transition.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const canvasRef = useRef()
  const overlayRef = useRef()
  const navRef = useRef()
  const lenisRef = useRef(null)
  const booted = useRef(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (booted.current) return
    booted.current = true

    const sceneApi = initScene(canvasRef.current)

    if (!reduced) {
      const lenis = new Lenis({ lerp: 0.1 })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((t) => lenis.raf(t * 1000))
      gsap.ticker.lagSmoothing(0)
      lenisRef.current = lenis
    }

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        sceneApi.setProgress(self.progress)
        gsap.set('.progress-bar', { scaleX: self.progress })
      },
    })

    initCursor()
    magnetize(navRef.current)

    const intro = gsap.timeline()
    intro
      .to('.preloader-text', { opacity: 1, duration: 0.5 })
      .to('#preloader', { yPercent: -100, duration: 0.8, ease: 'power4.inOut', delay: 0.3 })
      .set('#preloader', { display: 'none' })
      .from('.nav', { opacity: 0, y: -16, duration: 0.5 }, '-=0.3')
    if (reduced) intro.progress(1)
  }, [])

  const scrollTo = (target, immediate = false) => {
    if (lenisRef.current) lenisRef.current.scrollTo(target, { immediate })
    else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView()
    else window.scrollTo(0, target)
  }

  const go = (to, targetId) => {
    if (to === pathname) {
      if (targetId) scrollTo('#' + targetId)
      return
    }
    if (reduced) {
      navigate(to)
      requestAnimationFrame(() => scrollTo(targetId ? '#' + targetId : 0, true))
      return
    }
    const overlay = overlayRef.current
    gsap
      .timeline()
      .set(overlay, { display: 'block' })
      .fromTo(overlay, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power4.inOut' })
      .add(() => navigate(to))
      // new page mounts under the overlay; snap scroll while covered
      .add(() => {
        scrollTo(targetId ? '#' + targetId : 0, true)
        ScrollTrigger.refresh()
      }, '+=0.15')
      .to(overlay, { yPercent: -100, duration: 0.5, ease: 'power4.inOut' })
      .set(overlay, { display: 'none' })
  }

  return (
    <TransitionContext.Provider value={go}>
      <div id="preloader"><span className="preloader-text">PG</span></div>
      <div className="progress-bar" aria-hidden="true" />
      <div className="cursor" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
      <div className="page-overlay" ref={overlayRef} aria-hidden="true" />
      <canvas id="webgl" ref={canvasRef} aria-hidden="true" />

      <header className="nav" ref={navRef}>
        <TLink to="/" className="nav-logo" data-magnetic>PG</TLink>
        <nav className="nav-links">
          <TLink to="/" targetId="work" data-magnetic>Work</TLink>
          <TLink to="/" targetId="about" data-magnetic>About</TLink>
          <TLink to="/" targetId="contact" data-magnetic>Contact</TLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </TransitionContext.Provider>
  )
}
