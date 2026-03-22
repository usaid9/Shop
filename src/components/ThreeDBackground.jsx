import { Component, Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, PerspectiveCamera } from '@react-three/drei'
import { useTheme } from '../hooks/useTheme'

class ThreeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false } }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

function Particles({ count = 140, isDark }) {
  const mesh = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      arr[i]     = (Math.random() - 0.5) * 40
      arr[i + 1] = (Math.random() - 0.5) * 40
      arr[i + 2] = (Math.random() - 0.5) * 40
    }
    return arr
  }, [count])

  useEffect(() => {
    let id
    const animate = () => {
      const pos = mesh.current?.geometry?.attributes?.position
      if (pos) {
        for (let i = 1; i < pos.array.length; i += 3) {
          pos.array[i] -= 0.01
          if (pos.array[i] < -20) pos.array[i] = 20
        }
        pos.needsUpdate = true
      }
      id = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* Light mode: deeper red dots, more visible against warm bg */}
      <pointsMaterial
        size={isDark ? 0.18 : 0.20}
        color={isDark ? 0xc8102e : 0xb00e28}
        sizeAttenuation
        transparent
        opacity={isDark ? 0.75 : 0.50}
      />
    </points>
  )
}

function FloatingMesh({ isDark }) {
  const mesh = useRef(null)
  useEffect(() => {
    let id
    const animate = () => {
      if (mesh.current) {
        mesh.current.rotation.x += 0.0003
        mesh.current.rotation.y += 0.0005
        mesh.current.rotation.z += 0.0002
      }
      id = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <mesh ref={mesh} position={[0, 0, -10]}>
      <icosahedronGeometry args={[8, 4]} />
      {isDark ? (
        /* Dark: vivid red wireframe glow */
        <meshPhongMaterial
          color={0x1a0505}
          wireframe
          emissive={0xc8102e}
          emissiveIntensity={0.70}
        />
      ) : (
        /* Light: visible terracotta wireframe */
        <meshPhongMaterial
          color={0xb04020}
          wireframe
          emissive={0xc8102e}
          emissiveIntensity={0.28}
          opacity={0.40}
          transparent
        />
      )}
    </mesh>
  )
}

export default function ThreeDBackground() {
  const { isDark } = useTheme()

  return (
    <ThreeErrorBoundary>
      <Suspense fallback={null}>
        <Canvas
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 30]} />
          <ambientLight intensity={isDark ? 0.05 : 0.55} />
          {/* Primary red key light */}
          <pointLight position={[20, 20, 20]}  intensity={isDark ? 1.8 : 0.6}  color={0xc8102e} />
          {/* Fill from opposite corner */}
          <pointLight position={[-20, -20, -20]} intensity={isDark ? 0.8 : 0.3} color={isDark ? 0xc8102e : 0xd4a89a} />
          {/* Centre bloom — makes mesh edges glow outward */}
          <pointLight position={[0, 0, 8]}  intensity={isDark ? 0.6 : 0.25} color={0xc8102e} />
          <Particles count={140} isDark={isDark} />
          <FloatingMesh isDark={isDark} />
          {isDark && <Stars radius={100} depth={50} count={700} factor={4} fade speed={0.15} />}
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  )
}
