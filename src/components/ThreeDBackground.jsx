import { Component, Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, PerspectiveCamera } from '@react-three/drei'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

// ─── Error boundary ───────────────────────────────────────────────────────────
class ThreeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false } }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

// ─── Shared input state (module-level — no re-renders) ────────────────────────
// x/y normalised roughly -1..1 for both mouse and gyro
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

// ─── Camera rig ───────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree()
  const cur = useRef({ x: 0, y: 0 })
  useFrame(() => {
    cur.current.x += (input.x * 3.5 - cur.current.x) * 0.04
    cur.current.y += (input.y * 2.0 - cur.current.y) * 0.04
    camera.position.x = cur.current.x
    camera.position.y = cur.current.y
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Stars — drift opposite to camera for parallax depth ─────────────────────
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

// ─── Floating wireframe mesh ──────────────────────────────────────────────────
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
        : opacityRef.current * 0.38
    }
  })

  const GeoTag = config.geo
  return (
    <mesh ref={mesh} position={config.pos}>
      <GeoTag args={config.args} />
      {isDark ? (
        <meshPhongMaterial color={0x1a0505} wireframe emissive={0xc8102e} emissiveIntensity={0.72} transparent opacity={0} />
      ) : (
        <meshPhongMaterial color={0xb04020} wireframe emissive={0xc8102e} emissiveIntensity={0.30} transparent opacity={0} />
      )}
    </mesh>
  )
}

// ─── Particles ────────────────────────────────────────────────────────────────
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
        color={isDark ? 0xc8102e : 0xb00e28}
        sizeAttenuation transparent
        opacity={isDark ? 0.75 : 0.48}
      />
    </points>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ modelConfig, isDark }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 30]} />
      <CameraRig />
      <ambientLight intensity={isDark ? 0.05 : 0.55} />
      <pointLight position={[20, 20, 20]}    intensity={isDark ? 1.8 : 0.6}  color={0xc8102e} />
      <pointLight position={[-20, -20, -20]} intensity={isDark ? 0.8 : 0.3}  color={isDark ? 0xc8102e : 0xd4a89a} />
      <pointLight position={[0, 0, 8]}       intensity={isDark ? 0.6 : 0.25} color={0xc8102e} />
      <Particles count={140} isDark={isDark} />
      <FloatingMesh config={modelConfig} isDark={isDark} />
      {isDark && <ReactiveStars />}
    </>
  )
}

// ─── Gyro hook — requests permission on iOS 13+, falls back gracefully ────────
function useGyro() {
  useEffect(() => {
    // Only attach on touch devices
    if (!('ontouchstart' in window)) return

    const handleOrientation = (e) => {
      // gamma = left/right tilt (-90..90), beta = front/back tilt (-180..180)
      // Clamp to ±30° and normalise to -1..1 for comfortable range
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
      input.x =  clamp(e.gamma ?? 0, -30, 30) / 30   // left/right → X
      input.y = -clamp((e.beta  ?? 0) - 30, -30, 30) / 30  // tilt fwd/back → Y (offset by 30° for neutral hold angle)
    }

    const attach = () => window.addEventListener('deviceorientation', handleOrientation, { passive: true })

    // iOS 13+ requires explicit permission
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // We can only call this from a user gesture — listen for first touch
      const onFirstTouch = () => {
        DeviceOrientationEvent.requestPermission()
          .then(state => { if (state === 'granted') attach() })
          .catch(() => {})
        window.removeEventListener('touchstart', onFirstTouch)
      }
      window.addEventListener('touchstart', onFirstTouch, { once: true })
    } else {
      // Android / non-permission browsers
      attach()
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ThreeDBackground() {
  const { isDark }   = useTheme()
  const location     = useLocation()
  const modelConfig  = getModelConfig(location.pathname)

  // ── Desktop: mouse ──
  useEffect(() => {
    if ('ontouchstart' in window) return   // skip on touch devices
    const onMove = (e) => {
      input.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      input.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Mobile: gyro ──
  useGyro()

  return (
    <ThreeErrorBoundary>
      <Suspense fallback={null}>
        <Canvas
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <Scene key={location.pathname} modelConfig={modelConfig} isDark={isDark} />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  )
}
