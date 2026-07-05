import gsap from 'gsap'

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
export const hoverable = matchMedia('(hover: hover)').matches
export const firstVisit = { value: true }

export function initCursor() {
  if (!hoverable) return
  const dot = document.querySelector('.cursor')
  const ring = document.querySelector('.cursor-ring')
  const xD = gsap.quickTo(dot, 'x', { duration: 0.1 })
  const yD = gsap.quickTo(dot, 'y', { duration: 0.1 })
  const xR = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' })
  const yR = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' })
  addEventListener('pointermove', (e) => {
    xD(e.clientX); yD(e.clientY); xR(e.clientX); yR(e.clientY)
  })
  // delegation so links added by route changes work without re-binding
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('a, button')) ring.classList.add('is-hover')
  })
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('a, button')) ring.classList.remove('is-hover')
  })
  document.body.classList.add('has-cursor')
}

export function magnetize(scope) {
  if (!hoverable) return
  scope.querySelectorAll('[data-magnetic]').forEach((el) => {
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

export function tilt(scope) {
  if (!hoverable) return
  scope.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      gsap.to(card, {
        rotateY: ((e.clientX - r.left - r.width / 2) / r.width) * 6,
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

export function reveals(scope) {
  scope.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  })
}

export function splitTitles(scope) {
  scope.querySelectorAll('.section-title').forEach((el) => {
    gsap.from(el.querySelectorAll('.char'), {
      yPercent: 120,
      opacity: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    })
  })
}
