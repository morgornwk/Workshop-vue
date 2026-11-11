import * as THREE from 'three'

// --- Compact Geometry / Material / Canvas Helpers ---

const SIDES = [-1, 1]
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d)
const cyl = (rt, rb, h, s = 16) => new THREE.CylinderGeometry(rt, rb, h, s)
const sph = (r, w = 16, h = 14) => new THREE.SphereGeometry(r, w, h)
const std = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, ...opts })

function mesh(geo, mat, { pos, rot, scale, shadow } = {}) {
  const m = new THREE.Mesh(geo, mat)
  if (pos) m.position.set(...pos)
  if (rot) m.rotation.set(...rot)
  if (scale) m.scale.set(...scale)
  if (shadow) m.castShadow = m.receiveShadow = true
  return m
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// --- Procedural Textures ---

function createEyeTexture() {
  return canvasTex(256, 256, (ctx, w, h) => {
    const [cx, cy, rx, ry] = [128, 132, 74, 88]
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.clip()

    const g = ctx.createLinearGradient(0, cy - ry, 0, cy + ry)
    g.addColorStop(0, '#0f172a')
    g.addColorStop(0.32, '#1e3a8a')
    g.addColorStop(0.68, '#0284c7')
    g.addColorStop(1, '#38bdf8')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.ellipse(cx, cy + 16, rx * 0.72, ry * 0.62, 0, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#090d1a'
    ctx.beginPath()
    ctx.ellipse(cx, cy - 2, 30, 38, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(103, 232, 249, 0.55)'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 44, 46, 20, 0, 0, Math.PI)
    ctx.fill()
    ctx.restore()

    // Upper lash & anime catchlights
    ctx.strokeStyle = '#0b1020'
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx + 2, ry + 2, 0, Math.PI * 1.08, Math.PI * 1.92)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(cx - 28, cy - 34, 18, 22, -0.25, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + 26, cy + 30, 9, 0, Math.PI * 2)
    ctx.fill()
  })
}

function createBlushTexture() {
  return canvasTex(128, 64, (ctx, w, h) => {
    const g = ctx.createRadialGradient(64, 32, 6, 64, 32, 56)
    g.addColorStop(0, 'rgba(244, 114, 182, 0.48)')
    g.addColorStop(0.6, 'rgba(244, 114, 182, 0.16)')
    g.addColorStop(1, 'rgba(244, 114, 182, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  })
}

function createScreenTexture(variant = 'ide') {
  const isVert = variant === 'vertical'
  return canvasTex(isVert ? 384 : 512, isVert ? 512 : 320, (ctx, w, h) => {
    ctx.fillStyle = '#070b16'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, w, 28)
    ;['#ef4444', '#f59e0b', '#22c55e'].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(16 + i * 14, 14, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    let startX = 24
    if (variant === 'ide') {
      ctx.fillStyle = '#0b1121'
      ctx.fillRect(0, 28, 92, h - 28)
      startX = 112
      ;['#f97316', '#94a3b8', '#22d3ee', '#94a3b8', '#64748b', '#f97316'].forEach((c, i) => {
        ctx.fillStyle = c
        ctx.globalAlpha = i === 0 || i === 2 ? 0.85 : 0.4
        ctx.fillRect(16, 48 + i * 20, 44 + (i % 3) * 12, 6)
      })
      ctx.globalAlpha = 1
    }

    const palette = ['#f97316', '#22d3ee', '#a855f7', '#34d399', '#e2e8f0', '#60a5fa']
    const lines = isVert ? 18 : 13
    for (let i = 0; i < lines; i++) {
      const y = 48 + i * 18
      const indent = i % 4 === 1 || i % 4 === 2 ? 18 : i % 4 === 3 ? 34 : 0
      if (i === 4) {
        ctx.fillStyle = 'rgba(249, 115, 22, 0.14)'
        ctx.fillRect(startX - 10, y - 5, w - startX, 16)
      }
      ctx.fillStyle = 'rgba(148, 163, 184, 0.35)'
      ctx.fillRect(startX - 8, y, 6, 6)

      let cx = startX + indent + 8
      for (let t = 0; t < 2 + (i % 3); t++) {
        const tw = 22 + ((i * 17 + t * 29) % 58)
        if (cx + tw > w - 24) break
        ctx.fillStyle = palette[(i + t) % palette.length]
        ctx.fillRect(cx, y, tw, 6)
        cx += tw + 10
      }
    }

    if (variant !== 'laptop') {
      const ty = h - 76
      ctx.fillStyle = '#0b1020'
      ctx.fillRect(startX - 12, ty, w - startX + 12, 76)
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)'
      ctx.beginPath()
      ctx.moveTo(startX - 12, ty)
      ctx.lineTo(w, ty)
      ctx.stroke()
      ;[
        ['#f97316', 90, 16],
        ['#34d399', 150, 34],
        ['#22d3ee', 110, 52],
      ].forEach(([c, lw, oy]) => {
        ctx.fillStyle = c
        ctx.fillRect(startX, ty + oy, lw, 6)
      })
    }
  })
}

// --- Scene Builders ---

const MONITORS = [
  { pos: [-0.98, 1.15, 0.08], rotY: 0.78, bezel: [0.96, 0.56, 0.035], screen: [0.9, 0.5], standY: -0.22, variant: 'ide', emit: 0.9 },
  { pos: [1.02, 1.18, 0.02], rotY: -0.82, bezel: [0.52, 0.72, 0.032], screen: [0.47, 0.66], standY: -0.25, variant: 'vertical', emit: 0.85 },
]

const BANGS = [
  { pos: [-0.22, 0.12, 0.2], rot: [0.35, 0, 2.85], scale: [1.05, 1.05, 0.68] },
  { pos: [-0.14, 0.19, 0.25], rot: [0.45, 0, 3.0], scale: [1, 1, 0.65] },
  { pos: [-0.05, 0.21, 0.27], rot: [0.42, 0, 3.12], scale: [0.95, 0.95, 0.62] },
  { pos: [0.05, 0.22, 0.27], rot: [0.44, 0, -3.05], scale: [1.02, 1.02, 0.66] },
  { pos: [0.14, 0.19, 0.24], rot: [0.4, 0, -2.92], scale: [0.96, 0.96, 0.62] },
  { pos: [0.22, 0.12, 0.19], rot: [0.35, 0, -2.8], scale: [1.05, 1.05, 0.68] },
  { pos: [-0.28, 0, 0.12], rot: [0.18, 0, 3.05], scale: [1.15, 1.15, 0.75] },
  { pos: [0.28, 0, 0.12], rot: [0.18, 0, -3.05], scale: [1.15, 1.15, 0.75] },
  { pos: [0.04, 0.39, -0.02], rot: [-0.25, 0, -0.38], scale: [0.8, 0.8, 0.52] },
]

function screenMat(variant, intensity) {
  const tex = createScreenTexture(variant)
  return std('#ffffff', { map: tex, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: intensity, roughness: 0.25 })
}

function buildWorkspace(mats) {
  const group = new THREE.Group()
  const legGeo = box(0.06, 0.74, 0.85)

  group.add(
    mesh(box(2.65, 0.07, 1.18), mats.desk, { pos: [0, 0.74, 0.16], shadow: true }),
    ...SIDES.map((s) => mesh(legGeo, mats.metal, { pos: [s * 1.18, 0.37, 0.15] })),
    mesh(box(2.58, 0.022, 0.025), mats.rgb, { pos: [0, 0.765, -0.42] }),
    mesh(box(1.18, 0.01, 0.56), std('#070b14', { roughness: 0.9 }), { pos: [0, 0.78, 0.32] }),
    mesh(box(0.62, 0.78, 0.09), mats.metal, { pos: [0, 1.08, -0.58], rot: [-0.08, 0, 0] }),
    mesh(box(0.36, 0.04, 0.1), mats.glow, { pos: [0, 1.32, -0.59] }),
    mesh(box(0.56, 0.024, 0.2), mats.metal, { pos: [-0.04, 0.795, 0.34] }),
    mesh(box(0.52, 0.008, 0.16), mats.rgb, { pos: [-0.04, 0.806, 0.34] }),
    mesh(box(0.08, 0.026, 0.12), mats.metal, { pos: [0.34, 0.795, 0.38] })
  )

  MONITORS.forEach((m) => {
    const mon = new THREE.Group()
    mon.position.set(...m.pos)
    mon.rotation.y = m.rotY
    mon.add(
      mesh(cyl(0.023, 0.033, 0.36, 12), mats.metal, { pos: [0, m.standY, -0.04] }),
      mesh(box(...m.bezel), mats.metal, { shadow: true }),
      mesh(new THREE.PlaneGeometry(...m.screen), screenMat(m.variant, m.emit), { pos: [0, 0, 0.02] })
    )
    group.add(mon)
  })

  // Laptop
  const laptop = new THREE.Group()
  laptop.position.set(0.56, 0.785, 0.38)
  laptop.rotation.y = -0.45
  const lid = new THREE.Group()
  lid.position.set(0, 0.01, -0.135)
  lid.rotation.x = -0.34
  lid.add(
    mesh(box(0.42, 0.26, 0.012), mats.metal, { pos: [0, 0.13, 0] }),
    mesh(new THREE.PlaneGeometry(0.39, 0.23), screenMat('laptop', 0.8), { pos: [0, 0.13, 0.008] })
  )
  laptop.add(mesh(box(0.42, 0.016, 0.28), mats.metal), lid)
  group.add(laptop)

  // Matcha mug + rising steam
  const mug = new THREE.Group()
  mug.position.set(-0.56, 0.775, 0.45)
  mug.add(
    mesh(cyl(0.052, 0.046, 0.11, 20), std('#e2e8f0', { roughness: 0.35 }), { pos: [0, 0.055, 0] }),
    mesh(new THREE.CircleGeometry(0.046, 18), std('#4ade80', { roughness: 0.4 }), { pos: [0, 0.108, 0], rot: [-Math.PI / 2, 0, 0] })
  )
  const steamGeo = sph(0.018, 10, 10)
  const steamPuffs = [0, 1, 2].map((i) => {
    const puff = mesh(steamGeo, new THREE.MeshBasicMaterial({ color: '#cbd5e1', transparent: true, opacity: 0.35 }), {
      pos: [(i - 1) * 0.015, 0.15 + i * 0.04, 0],
    })
    mug.add(puff)
    return { mesh: puff, offset: i * 2.1 }
  })
  group.add(mug)

  return { deskGroup: group, steamPuffs }
}

function createHeadGeometry() {
  const geo = sph(0.32, 36, 32)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    v.x *= 0.94
    v.y *= 1.03
    if (v.y < 0) {
      const t = Math.min(1, Math.abs(v.y) / 0.33)
      v.x *= 1 - t * 0.24
      if (v.z > 0) v.z *= 1 - t * 0.1
    }
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

function buildCharacter(mats) {
  const charGroup = new THREE.Group()
  charGroup.position.set(0, 0, -0.26)

  const torsoGroup = new THREE.Group()
  torsoGroup.position.set(0, 0.96, 0)
  torsoGroup.add(
    mesh(cyl(0.22, 0.27, 0.48, 24), mats.hoodie, { shadow: true }),
    mesh(new THREE.TorusGeometry(0.18, 0.065, 14, 28), mats.hoodie, { pos: [0, 0.22, -0.02], rot: [Math.PI / 2.2, 0, 0] }),
    mesh(cyl(0.075, 0.085, 0.14), mats.skin, { pos: [0, 0.27, 0.01] }),
    ...SIDES.map((s) => mesh(cyl(0.008, 0.008, 0.16, 8), mats.glow, { pos: [s * 0.06, 0.12, 0.22] }))
  )

  const [leftArmGroup, rightArmGroup] = SIDES.map((s) => {
    const arm = new THREE.Group()
    arm.position.set(s * 0.24, 1.12, 0.02)
    arm.add(
      mesh(cyl(0.055, 0.048, 0.34, 14), mats.hoodie, { pos: [s * -0.04, -0.14, 0.16], rot: [1.05, 0, s * 0.25] }),
      mesh(sph(0.052, 14, 14), mats.skin, { pos: [s * -0.09, -0.27, 0.36] })
    )
    return arm
  })

  const headGroup = new THREE.Group()
  headGroup.position.set(0, 1.48, 0.02)
  headGroup.add(
    mesh(createHeadGeometry(), mats.skin, { shadow: true }),
    mesh(sph(0.015, 10, 10), mats.skin, { pos: [0, -0.05, 0.315] }),
    mesh(new THREE.TorusGeometry(0.032, 0.0055, 8, 16, Math.PI * 0.75), new THREE.MeshBasicMaterial({ color: '#9d4d5d' }), {
      pos: [0, -0.105, 0.295],
      rot: [0, 0, Math.PI * 1.125],
    })
  )

  // Ears, blush, hair & headphones
  const earGeo = sph(0.065, 14, 14)
  const blushMat = new THREE.MeshBasicMaterial({ map: createBlushTexture(), transparent: true, depthWrite: false })
  const cupGeo = cyl(0.095, 0.095, 0.065, 20)
  const ringGeo = new THREE.TorusGeometry(0.072, 0.008, 10, 24)
  headGroup.add(mesh(new THREE.TorusGeometry(0.35, 0.028, 12, 32, Math.PI), mats.metal, { pos: [0, 0.06, -0.01] }))

  SIDES.forEach((s) => {
    headGroup.add(
      mesh(earGeo, mats.skin, { pos: [s * 0.3, -0.02, -0.02], scale: [0.55, 1, 0.7] }),
      mesh(new THREE.PlaneGeometry(0.11, 0.055), blushMat, { pos: [s * 0.145, -0.075, 0.275], rot: [0, s * 0.32, 0] }),
      mesh(cupGeo, mats.metal, { pos: [s * 0.335, -0.02, -0.01], rot: [0, 0, Math.PI / 2] }),
      mesh(ringGeo, mats.glow, { pos: [s * 0.369, -0.02, -0.01], rot: [0, Math.PI / 2, 0] })
    )
  })

  const lockGeo = new THREE.ConeGeometry(0.068, 0.25, 14)
  headGroup.add(
    mesh(sph(0.34, 28, 24), mats.hair, { pos: [0, 0.055, -0.045], scale: [1.02, 0.98, 1.04] }),
    mesh(sph(0.31, 22, 18), mats.hair, { pos: [0, -0.1, -0.13], scale: [1.04, 0.95, 0.85] }),
    ...BANGS.map((b) => mesh(lockGeo, mats.hair, b))
  )

  const scleraMat = new THREE.MeshBasicMaterial({ color: '#f8fafc' })
  const irisMat = new THREE.MeshBasicMaterial({ map: createEyeTexture(), transparent: true })
  const [leftEye, rightEye] = SIDES.map((s) => {
    const socket = new THREE.Group()
    socket.position.set(s * 0.112, -0.015, 0.278)
    socket.rotation.y = s * 0.18
    const iris = mesh(new THREE.PlaneGeometry(0.118, 0.132), irisMat, { pos: [0, 0, 0.004] })
    socket.add(
      mesh(new THREE.CircleGeometry(0.068, 24), scleraMat, { scale: [0.92, 1.08, 1] }),
      iris,
      mesh(box(0.105, 0.014, 0.014), mats.hair, { pos: [0, 0.092, 0.012], rot: [0, 0, s * 0.08] })
    )
    headGroup.add(socket)
    return { socket, iris }
  })

  charGroup.add(torsoGroup, leftArmGroup, rightArmGroup, headGroup)
  return { charGroup, torsoGroup, leftArmGroup, rightArmGroup, headGroup, leftEye, rightEye }
}

/**
 * Builds and runs the interactive 3D anime developer scene inside a DOM container.
 */
export function buildDeveloperScene(container, { reducedMotion = false } = {}) {
  const width = container.clientWidth || 520
  const height = container.clientHeight || 560

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40)
  camera.position.set(0.15, 1.54, 3.85)
  camera.lookAt(0, 1.04, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  // Lighting
  scene.add(new THREE.AmbientLight('#94a3b8', 0.85))
  const keyLight = new THREE.DirectionalLight('#f8fafc', 1.35)
  keyLight.position.set(2.5, 4.2, 3.2)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(1024, 1024)
  keyLight.shadow.bias = -0.001
  scene.add(keyLight)

  ;[
    ['#f97316', 2.8, 6, [1.35, 1.75, -0.9]],
    ['#22d3ee', 2.2, 5.5, [-0.95, 1.4, 0.95]],
    ['#3b82f6', 1.6, 5, [0, 0.55, 0.7]],
  ].forEach(([color, intensity, dist, pos]) => {
    const light = new THREE.PointLight(color, intensity, dist)
    light.position.set(...pos)
    scene.add(light)
  })

  const mats = {
    skin: std('#fde4d6', { roughness: 0.72, metalness: 0.02 }),
    hair: std('#14192d', { roughness: 0.42, metalness: 0.12 }),
    hoodie: std('#1e293b', { roughness: 0.85, metalness: 0.04 }),
    glow: std('#f97316', { emissive: '#f97316', emissiveIntensity: 0.85, roughness: 0.35 }),
    metal: std('#0b1020', { roughness: 0.38, metalness: 0.65 }),
    desk: std('#0f172a', { roughness: 0.45, metalness: 0.25 }),
    rgb: std('#f97316', { emissive: '#f97316', emissiveIntensity: 1.5 }),
  }

  const stage = new THREE.Group()
  stage.position.set(0, -0.08, 0)
  scene.add(stage)

  const { deskGroup, steamPuffs } = buildWorkspace(mats)
  const character = buildCharacter(mats)
  const orbGeo = new THREE.OctahedronGeometry(0.045, 0)
  const orbs = [
    [-1.45, 1.85, -0.4, '#f97316'],
    [1.48, 1.9, -0.35, '#22d3ee'],
    [-1.25, 0.95, 0.65, '#a855f7'],
    [1.32, 1.05, 0.72, '#f97316'],
  ].map(([x, y, z, c], i) => {
    const m = mesh(orbGeo, std(c, { emissive: c, emissiveIntensity: 1.2, roughness: 0.2, transparent: true, opacity: 0.85 }), { pos: [x, y, z] })
    stage.add(m)
    return { mesh: m, baseY: y, offset: i * 1.4 }
  })
  stage.add(deskGroup, character.charGroup)

  const mouse = { x: 0, y: 0 }
  const clock = new THREE.Clock()
  let isVisible = true
  let rafId = null
  let blinkTimer = 0
  let nextBlink = 3.2

  function update(dt, t) {
    const { headGroup, leftEye, rightEye, torsoGroup, leftArmGroup, rightArmGroup } = character

    headGroup.rotation.y += (mouse.x * 0.34 - headGroup.rotation.y) * 0.08
    headGroup.rotation.x += (-mouse.y * 0.22 - headGroup.rotation.x) * 0.08
    ;[leftEye, rightEye].forEach(({ iris }) => {
      iris.position.x += (mouse.x * 0.02 - iris.position.x) * 0.16
      iris.position.y += (mouse.y * 0.016 - iris.position.y) * 0.16
    })
    stage.rotation.y += (mouse.x * 0.09 - stage.rotation.y) * 0.05
    stage.rotation.x += (-mouse.y * 0.045 - stage.rotation.x) * 0.05

    blinkTimer += dt
    let eyeY = 1
    if (blinkTimer >= nextBlink) {
      const p = (blinkTimer - nextBlink) / 0.16
      if (p < 1) eyeY = 1 - Math.sin(p * Math.PI) * 0.92
      else {
        blinkTimer = 0
        nextBlink = 2.8 + Math.random() * 2.5
      }
    }
    leftEye.socket.scale.y = rightEye.socket.scale.y = eyeY

    torsoGroup.position.y = 0.96 + Math.sin(t * 2.1) * 0.008
    leftArmGroup.position.y = 1.12 + Math.sin(t * 9.5) * 0.012
    rightArmGroup.position.y = 1.12 + Math.sin(t * 9.5 + 1.8) * 0.012

    const hue = 0.07 + Math.sin(t * 0.5) * 0.03
    mats.rgb.color.setHSL(hue, 0.92, 0.54)
    mats.rgb.emissive.setHSL(hue, 0.92, 0.5)

    steamPuffs.forEach((p) => {
      const c = (t * 0.6 + p.offset) % 1
      p.mesh.position.y = 0.13 + c * 0.14
      p.mesh.material.opacity = (1 - c) * 0.35
    })
    orbs.forEach((o) => {
      o.mesh.position.y = o.baseY + Math.sin(t * 1.4 + o.offset) * 0.09
      o.mesh.rotation.set(t * 0.5, t * 0.8 + o.offset, 0)
    })
  }

  function render() {
    const dt = Math.min(clock.getDelta(), 0.05)
    if (!reducedMotion) update(dt, clock.elapsedTime)
    renderer.render(scene, camera)
    if (isVisible && !reducedMotion) rafId = requestAnimationFrame(render)
  }

  renderer.render(scene, camera)
  if (!reducedMotion) rafId = requestAnimationFrame(render)

  const observer = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
        isVisible = Boolean(entries[0] && entries[0].isIntersecting)
        if (isVisible && !reducedMotion && !rafId) {
          clock.getDelta()
          rafId = requestAnimationFrame(render)
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }, { threshold: 0.05 })
    : null
  if (observer) observer.observe(container)

  return {
    setPointer(nx, ny) {
      mouse.x = Math.max(-1, Math.min(1, nx))
      mouse.y = Math.max(-1, Math.min(1, ny))
    },
    resize() {
      const w = container && container.clientWidth
      const h = container && container.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      if (reducedMotion) renderer.render(scene, camera)
    },
    dispose() {
      if (rafId) cancelAnimationFrame(rafId)
      if (observer) observer.disconnect()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
            if (m.map) m.map.dispose()
            if (m.emissiveMap) m.emissiveMap.dispose()
            m.dispose()
          })
        }
      })
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    },
  }
}
