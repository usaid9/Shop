import React from 'react'
import { Component, Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

// ─── Error boundary ───────────────────────────────────────────────────────────
class ThreeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false } }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

// ─── Shared input state (module-level — no re-renders) ────────────────────────
const input = { x: 0, y: 0 }

// ─── Per-route model config ───────────────────────────────────────────────────
const ROUTE_MODELS = {
  '/':            { geo: 'icosahedronGeometry', args: [8, 4],                  speed: [0.0003, 0.0005, 0.0002], pos: [0,  0, -10] },
  '/shop':        { geo: 'torusGeometry',       args: [6, 1.8, 16, 80],        speed: [0.0008, 0.0014, 0.0004], pos: [0,  0,  -8] },
  '/collections': { geo: 'torusKnotGeometry',   args: [5, 1.6, 120, 16],       speed: [0.0015, 0.0008, 0.0012], pos: [0,  0,  -8] },
  '/about':       { geo: 'octahedronGeometry',  args: [7, 3],                  speed: [0.0005, 0.0012, 0.0003], pos: [0,  0, -10] },
  '/contact':     { geo: 'dodecahedronGeometry',args: [7, 1],                  speed: [0.0006, 0.0010, 0.0008], pos: [0,  0, -10] },
  '/orders':      { geo: 'cylinderGeometry',    args: [5, 5, 12, 40, 1, true], speed: [0.0004, 0.0008, 0.0002], pos: [0,  1, -10] },
  '/product':     { geo: 'tetrahedronGeometry', args: [8, 3],                  speed: [0.0010, 0.0006, 0.0014], pos: [0,  0, -10] },
  '/admin':       { geo: 'icosahedronGeometry', args: [7, 2],                  speed: [0.0012, 0.0008, 0.0006], pos: [0,  0, -10] },
}
function getModelConfig(pathname) {
  if (ROUTE_MODELS[pathname]) return ROUTE_MODELS[pathname]
  const prefix = Object.keys(ROUTE_MODELS).find(k => k !== '/' && pathname.startsWith(k))
  return ROUTE_MODELS[prefix] || ROUTE_MODELS['/']
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FLOWING SILK — light mode only
// ═══════════════════════════════════════════════════════════════════════════════
const CLOTH_VERT = `
  uniform float uTime;
  uniform float uWindX;
  uniform float uWindY;
  uniform float uAmplitude;
  uniform float uFreqX;
  uniform float uFreqY;
  uniform float uSpeed;
  varying vec2  vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    float wave1 = sin(position.x * uFreqX + uTime * uSpeed + uWindX * 1.2)
                * cos(position.y * uFreqY + uTime * uSpeed * 0.7);
    float wave2 = sin(position.x * uFreqX * 1.4 + uTime * uSpeed * 0.8 + uWindX * 0.7)
                * sin(position.y * uFreqY * 1.6 + uTime * uSpeed * 1.1 + uWindY * 0.9);
    float drift = sin((position.x + position.y) * 0.4 + uTime * uSpeed * 0.5 + uWindX * 0.5);
    float z = (wave1 * 0.6 + wave2 * 0.3 + drift * 0.1) * uAmplitude;
    vWave = (z / uAmplitude) * 0.5 + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
  }
`

const CLOTH_FRAG = `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uOpacity;
  varying vec2  vUv;
  varying float vWave;

  void main() {
    vec2 dist = abs(vUv - 0.5) * 2.0;
    float fade = 1.0 - smoothstep(0.45, 1.0, max(dist.x, dist.y));
    float sheen = smoothstep(0.3, 0.7,
      sin(vUv.x * 3.14159 + vUv.y * 2.1 + vWave * 1.5) * 0.5 + 0.5);
    vec3 colour = mix(uColorA, uColorB, vWave);
    colour = mix(colour, vec3(1.0, 0.96, 0.94), sheen * 0.22);
    gl_FragColor = vec4(colour, uOpacity * fade);
  }
`

// ─── FIXED: Much higher opacity + vivid rose-pink tones matching screenshot ───
const SILK_LAYERS = [
  // Layer 0 — wide background drape, rose blush
  {
    pos:   [-2, 2, -22], rot: [0.08, 0.12, 0.05],
    size: [42, 30], segs: [80, 60],
    amp: 1.8, freqX: 0.22, freqY: 0.28, speed: 0.38,
    colorA: [0.98, 0.82, 0.82], colorB: [0.88, 0.65, 0.68],   // rose pink
    opacity: 0.48,
  },
  // Layer 1 — mid layer, warm coral
  {
    pos:   [7, -2, -17], rot: [-0.06, -0.18, 0.10],
    size: [30, 24], segs: [70, 52],
    amp: 2.2, freqX: 0.30, freqY: 0.22, speed: 0.52,
    colorA: [0.97, 0.75, 0.72], colorB: [0.84, 0.58, 0.55],   // coral
    opacity: 0.38,
  },
  // Layer 2 — narrow sash, deep terracotta
  {
    pos:   [-9, 4, -13], rot: [0.15, 0.08, -0.12],
    size: [16, 32], segs: [40, 80],
    amp: 2.8, freqX: 0.18, freqY: 0.38, speed: 0.65,
    colorA: [0.90, 0.62, 0.58], colorB: [0.75, 0.44, 0.40],   // terracotta
    opacity: 0.32,
  },
  // Layer 3 — foreground wisp, pale sakura
  {
    pos:   [5, -6, -8], rot: [0.05, 0.22, 0.08],
    size: [22, 18], segs: [56, 44],
    amp: 1.6, freqX: 0.42, freqY: 0.35, speed: 0.80,
    colorA: [1.00, 0.92, 0.92], colorB: [0.95, 0.80, 0.82],   // sakura
    opacity: 0.28,
  },
  // Layer 4 — wide low sweep, blush ivory (adds the big wash seen in screenshot)
  {
    pos:   [0, -8, -26], rot: [-0.04, 0.06, 0.03],
    size: [50, 22], segs: [90, 50],
    amp: 1.2, freqX: 0.16, freqY: 0.20, speed: 0.28,
    colorA: [1.00, 0.90, 0.88], colorB: [0.94, 0.80, 0.80],   // blush wash
    opacity: 0.42,
  },
]

function SilkLayer({ cfg, timeOffset = 0 }) {
  const uniforms = useMemo(() => ({
    uTime:      { value: timeOffset },
    uWindX:     { value: 0 },
    uWindY:     { value: 0 },
    uAmplitude: { value: cfg.amp },
    uFreqX:     { value: cfg.freqX },
    uFreqY:     { value: cfg.freqY },
    uSpeed:     { value: cfg.speed },
    uColorA:    { value: new THREE.Color(...cfg.colorA) },
    uColorB:    { value: new THREE.Color(...cfg.colorB) },
    uOpacity:   { value: cfg.opacity },
  }), [cfg])

  useFrame((_, delta) => {
    uniforms.uTime.value  += delta
    uniforms.uWindX.value += (input.x * 1.6 - uniforms.uWindX.value) * 0.07
    uniforms.uWindY.value += (input.y * 1.0 - uniforms.uWindY.value) * 0.07
  })

  return (
    <mesh position={cfg.pos} rotation={cfg.rot}>
      <planeGeometry args={[...cfg.size, ...cfg.segs]} />
      <shaderMaterial
        vertexShader={CLOTH_VERT}
        fragmentShader={CLOTH_FRAG}
        uniforms={uniforms}
        transparent side={THREE.DoubleSide} depthWrite={false}
      />
    </mesh>
  )
}

function FabricFlow() {
  return (
    <>{SILK_LAYERS.map((cfg, i) => <SilkLayer key={i} cfg={cfg} timeOffset={i * 3.7} />)}</>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DARK MODE ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function CameraRig({ isMobile }) {
  const { camera } = useThree()
  const cur = useRef({ x: 0, y: 0 })
  // Faster lerp on mobile so gyro feels snappy
  const lerpFactor = isMobile ? 0.08 : 0.04
  useFrame(() => {
    cur.current.x += (input.x * 3.5 - cur.current.x) * lerpFactor
    cur.current.y += (input.y * 2.0 - cur.current.y) * lerpFactor
    camera.position.x = cur.current.x
    camera.position.y = cur.current.y
    camera.lookAt(0, 0, 0)
  })
  return null
}

function ReactiveStars() {
  const group = useRef(null)
  const cur = useRef({ x: 0, y: 0 })
  useFrame(() => {
    if (!group.current) return
    cur.current.x += (-input.x * 0.012 - cur.current.x) * 0.03
    cur.current.y += ( input.y * 0.008 - cur.current.y) * 0.03
    group.current.rotation.y = cur.current.x
    group.current.rotation.x = cur.current.y
  })
  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={700} factor={4} fade speed={0.15} />
    </group>
  )
}

function FloatingMesh({ config, isDark }) {
  const mesh = useRef(null)
  const opacityRef = useRef(0)
  const tilt = useRef({ x: 0, y: 0 })
  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.x += config.speed[0]
    mesh.current.rotation.y += config.speed[1]
    mesh.current.rotation.z += config.speed[2]
    tilt.current.x += (input.y * 0.18 - tilt.current.x) * 0.05
    tilt.current.y += (input.x * 0.22 - tilt.current.y) * 0.05
    mesh.current.rotation.x += tilt.current.x * delta
    mesh.current.rotation.y += tilt.current.y * delta
    opacityRef.current = Math.min(opacityRef.current + delta * 0.9, 1)
    if (mesh.current.material) {
      mesh.current.material.opacity = isDark
        ? opacityRef.current * 0.90
        : opacityRef.current * 0.40   // clearly visible in light mode too
    }
  })
  const GeoTag = config.geo
  return (
    <mesh ref={mesh} position={config.pos}>
      <GeoTag args={config.args} />
      {isDark ? (
        <meshPhongMaterial color={0x1a0505} wireframe emissive={0xc8102e} emissiveIntensity={0.72} transparent opacity={0} />
      ) : (
        <meshPhongMaterial color={0xc04030} wireframe emissive={0xc8102e} emissiveIntensity={0.35} transparent opacity={0} />
      )}
    </mesh>
  )
}

function Particles({ count = 140, isDark }) {
  const mesh = useRef(null)
  const drift = useRef({ x: 0, y: 0 })
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      arr[i]     = (Math.random() - 0.5) * 40
      arr[i + 1] = (Math.random() - 0.5) * 40
      arr[i + 2] = (Math.random() - 0.5) * 40
    }
    return arr
  }, [count])
  useFrame(() => {
    const pos = mesh.current?.geometry?.attributes?.position
    if (!pos) return
    drift.current.x += (input.x * 0.06 - drift.current.x) * 0.025
    drift.current.y += (input.y * 0.06 - drift.current.y) * 0.025
    for (let i = 0; i < pos.array.length; i += 3) {
      pos.array[i + 1] -= 0.012
      if (pos.array[i + 1] < -20) pos.array[i + 1] = 20
      pos.array[i]     += drift.current.x * 0.02
      pos.array[i + 2] += drift.current.y * 0.01
    }
    pos.needsUpdate = true
  })
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.18 : 0.20}
        color={isDark ? 0xc8102e : 0xc84060}
        sizeAttenuation transparent
        opacity={isDark ? 0.75 : 0.45}
      />
    </points>
  )
}

function Scene({ modelConfig, isDark, isMobile }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 30]} />
      <CameraRig isMobile={isMobile} />

      {isDark ? (
        <>
          <ambientLight intensity={0.05} />
          <pointLight position={[20, 20, 20]}    intensity={1.8} color={0xc8102e} />
          <pointLight position={[-20, -20, -20]} intensity={0.8} color={0xc8102e} />
          <pointLight position={[0, 0, 8]}       intensity={0.6} color={0xc8102e} />
        </>
      ) : (
        <>
          <ambientLight intensity={1.1} color={0xfff0f0} />
          <pointLight position={[15, 20, 15]}   intensity={1.0} color={0xffcccc} />
          <pointLight position={[-15, -10, 10]} intensity={0.6} color={0xc84060} />
          <pointLight position={[0, 0, 20]}     intensity={0.5} color={0xffeeee} />
        </>
      )}

      <Particles count={140} isDark={isDark} />
      <FloatingMesh config={modelConfig} isDark={isDark} />
      {isDark  && <ReactiveStars />}
      {!isDark && <FabricFlow />}
    </>
  )
}

// ─── Gyro hook — pauses during scroll to prevent deformation ─────────────────
function useGyro() {
  useEffect(() => {
    if (!('ontouchstart' in window)) return

    let scrollTimeout = null
    let isScrolling = false

    // Freeze gyro input while finger is scrolling
    const onScrollStart = () => {
      isScrolling = true
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => { isScrolling = false }, 200)
    }

    const handleOrientation = (e) => {
      if (isScrolling) return   // ← FIX: ignore gyro during scroll
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
      // Tighter clamp ±18° → more responsive, wider arc of motion
      input.x =  clamp(e.gamma ?? 0, -18, 18) / 18
      input.y = -clamp((e.beta  ?? 0) - 30, -18, 18) / 18
    }

    const attach = () => {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
      // Listen to scroll to freeze gyro
      window.addEventListener('touchmove', onScrollStart, { passive: true })
    }

    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const onFirstTouch = () => {
        DeviceOrientationEvent.requestPermission()
          .then(state => { if (state === 'granted') attach() })
          .catch(() => {})
      }
      window.addEventListener('touchstart', onFirstTouch, { once: true })
    } else {
      attach()
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('touchmove', onScrollStart)
      clearTimeout(scrollTimeout)
    }
  }, [])
}

// ─── Lock height to initial innerHeight, only update on orientation change ────
//
// Chrome on Android hides/shows the address bar on scroll, which changes the
// visual viewport height (and therefore 100vh / inset:0 / bottom:0).  Every
// time that happens Three.js receives a resize event, recalculates the camera
// aspect ratio, and the mesh deforms for several frames.
//
// The fix: capture window.innerHeight ONCE on mount (before any scroll), store
// it as a CSS custom property AND a React state value, then ONLY update it on
// orientationchange — never on scroll-driven resize.
//
function useLockedHeight() {
  const getH = () => (typeof window !== 'undefined' ? window.innerHeight : 600)
  const [height, setHeight] = React.useState(getH)

  useEffect(() => {
    // Write the CSS variable so body::after / #glow-ambient use the same value
    document.documentElement.style.setProperty('--app-height', `${getH()}px`)

    const onOrientationChange = () => {
      // Small delay so the browser has finished the rotation layout
      setTimeout(() => {
        const h = window.innerHeight
        setHeight(h)
        document.documentElement.style.setProperty('--app-height', `${h}px`)
      }, 300)
    }

    window.addEventListener('orientationchange', onOrientationChange)
    return () => window.removeEventListener('orientationchange', onOrientationChange)
  }, [])

  return height
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ThreeDBackground() {
  const { isDark }  = useTheme()
  const location    = useLocation()
  const modelConfig = getModelConfig(location.pathname)
  const isMobile    = typeof window !== 'undefined' && 'ontouchstart' in window
  const lockedHeight = useLockedHeight()

  // Desktop mouse
  useEffect(() => {
    if (isMobile) return
    const onMove = (e) => {
      input.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      input.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobile])

  useGyro()

  return (
    <ThreeErrorBoundary>
      <Suspense fallback={null}>
        <Canvas
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%',
            // Use the locked pixel height — NOT inset:0 / bottom:0.
            // inset:0 binds the bottom edge to the visual viewport, so Chrome's
            // address-bar animation directly resizes the canvas and deforms the mesh.
            // A pixel height captured before any scroll never changes mid-animation.
            height: lockedHeight,
            pointerEvents: 'none', zIndex: 0,
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
          }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <Scene key={location.pathname} modelConfig={modelConfig} isDark={isDark} isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  )
}
