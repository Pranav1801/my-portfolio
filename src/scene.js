import * as THREE from 'three'

// Particle field that morphs between shapes as you scroll:
// hero: galaxy spiral → about/skills: wave plane → work: torus knot → contact: ring
const COUNT = 6000

function makeShapes() {
  const shapes = []
  const rand = (s) => (Math.sin(s * 12.9898) * 43758.5453) % 1

  const galaxy = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT
    const angle = t * Math.PI * 10
    const radius = t * 9 + rand(i) * 0.8
    galaxy[i * 3] = Math.cos(angle) * radius
    galaxy[i * 3 + 1] = (rand(i + 1) - 0.5) * (1.5 - t)
    galaxy[i * 3 + 2] = Math.sin(angle) * radius - 4
  }
  shapes.push(galaxy)

  const wave = new Float32Array(COUNT * 3)
  const side = Math.ceil(Math.sqrt(COUNT))
  for (let i = 0; i < COUNT; i++) {
    const x = ((i % side) / side - 0.5) * 22
    const z = (Math.floor(i / side) / side - 0.5) * 22
    wave[i * 3] = x
    wave[i * 3 + 1] = Math.sin(x * 0.6) * Math.cos(z * 0.6) * 1.6 - 2
    wave[i * 3 + 2] = z - 4
  }
  shapes.push(wave)

  const knot = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const t = (i / COUNT) * Math.PI * 2
    const p = 2, q = 3, r = 3.2 + Math.cos(q * t)
    knot[i * 3] = r * Math.cos(p * t) + (rand(i) - 0.5) * 0.5
    knot[i * 3 + 1] = r * Math.sin(p * t) + (rand(i + 2) - 0.5) * 0.5
    knot[i * 3 + 2] = Math.sin(q * t) * 1.6 - 5 + (rand(i + 3) - 0.5) * 0.5
  }
  shapes.push(knot)

  const ring = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const t = (i / COUNT) * Math.PI * 2
    const r = 5 + (rand(i) - 0.5) * 1.4
    ring[i * 3] = Math.cos(t) * r
    ring[i * 3 + 1] = Math.sin(t) * r
    ring[i * 3 + 2] = -6 + (rand(i + 1) - 0.5) * 1.4
  }
  shapes.push(ring)

  return shapes
}

function circleSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

export function initScene(canvas) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
  renderer.setSize(innerWidth, innerHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
  camera.position.z = 11

  const shapes = makeShapes()
  const positions = new Float32Array(shapes[0])
  const colors = new Float32Array(COUNT * 3)
  const accent = new THREE.Color('#d9ff3f')
  const white = new THREE.Color('#9aa0b4')
  for (let i = 0; i < COUNT; i++) {
    const c = white.clone().lerp(accent, (i / COUNT) * 0.9)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.09,
      map: circleSprite(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  )
  scene.add(points)

  let progress = 0 // 0..1 page scroll
  const mouse = { x: 0, y: 0 }
  addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / innerWidth - 0.5) * 2
    mouse.y = (e.clientY / innerHeight - 0.5) * 2
  })
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  })

  const pos = geo.attributes.position.array
  function frame(t) {
    const seg = Math.min(progress, 0.999) * (shapes.length - 1)
    const idx = Math.floor(seg)
    const blend = seg - idx
    const a = shapes[idx]
    const b = shapes[idx + 1]
    // ease positions toward blended target — cheap morph, no shaders
    for (let i = 0; i < pos.length; i++) {
      const target = a[i] + (b[i] - a[i]) * blend
      pos[i] += (target - pos[i]) * 0.06
    }
    geo.attributes.position.needsUpdate = true

    points.rotation.y = t * 0.00004 + progress * 1.2
    points.rotation.x = progress * 0.4
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04
    camera.position.y += (-mouse.y * 0.6 - camera.position.y) * 0.04
    camera.lookAt(0, 0, -4)
    renderer.render(scene, camera)
  }

  if (reduced) {
    frame(0) // static single render, no motion
  } else {
    renderer.setAnimationLoop(frame)
  }

  return { setProgress: (p) => (progress = p) }
}
