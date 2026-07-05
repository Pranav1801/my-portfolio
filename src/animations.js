import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export function initAnimations(sceneApi) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  // Smooth scroll (skip when user prefers reduced motion)
  if (!reduced) {
    const lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    // route anchor clicks through lenis so they don't fight the smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        e.preventDefault()
        lenis.scrollTo(a.getAttribute('href'))
      })
    )
  }

  // Drive the WebGL morph + progress bar from total page scroll
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      sceneApi.setProgress(self.progress)
      gsap.set('.progress-bar', { scaleX: self.progress })
    },
  })

  // Preloader → hero intro
  const intro = gsap.timeline()
  intro
    .to('.preloader-text', { opacity: 1, duration: 0.5 })
    .to('#preloader', { yPercent: -100, duration: 0.8, ease: 'power4.inOut', delay: 0.3 })
    .set('#preloader', { display: 'none' })
    .from('.hero-title .line-inner', { yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.5')
    .from('.hero-eyebrow, .hero-tagline, .scroll-hint, .nav', { opacity: 0, y: 20, stagger: 0.08, duration: 0.6 }, '-=0.6')

  if (reduced) {
    intro.progress(1)
    document.querySelectorAll('[data-reveal], [data-split]').forEach((el) => (el.style.opacity = 1))
    return
  }

  // Split section titles into chars for stagger reveals
  document.querySelectorAll('[data-split]').forEach((el) => {
    el.innerHTML = el.textContent
      .split('')
      .map((ch) => `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`)
      .join('')
    gsap.from(el.querySelectorAll('.char'), {
      yPercent: 120,
      opacity: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    })
  })

  // Generic fade-up reveals
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  })

  // Hero fades out as you scroll into about
  gsap.to('.hero', {
    opacity: 0,
    y: -80,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 40%', scrub: true },
  })

  initCursor()
  initMagnetic()
  initTilt()
}

function initCursor() {
  if (!matchMedia('(hover: hover)').matches) return
  const dot = document.querySelector('.cursor')
  const ring = document.querySelector('.cursor-ring')
  const xD = gsap.quickTo(dot, 'x', { duration: 0.1 })
  const yD = gsap.quickTo(dot, 'y', { duration: 0.1 })
  const xR = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' })
  const yR = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' })
  addEventListener('pointermove', (e) => {
    xD(e.clientX); yD(e.clientY); xR(e.clientX); yR(e.clientY)
  })
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('pointerenter', () => ring.classList.add('is-hover'))
    el.addEventListener('pointerleave', () => ring.classList.remove('is-hover'))
  })
  document.body.classList.add('has-cursor')
}

function initMagnetic() {
  if (!matchMedia('(hover: hover)').matches) return
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.3,
      })
    })
    el.addEventListener('pointerleave', () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    )
  })
}

function initTilt() {
  if (!matchMedia('(hover: hover)').matches) return
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      gsap.to(card, {
        rotateY: (e.clientX - r.left - r.width / 2) / r.width * 6,
        rotateX: -((e.clientY - r.top - r.height / 2) / r.height) * 6,
        transformPerspective: 800,
        duration: 0.4,
      })
    })
    card.addEventListener('pointerleave', () =>
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
    )
  })
}
