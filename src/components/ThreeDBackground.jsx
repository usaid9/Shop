import { Component, Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, PerspectiveCamera } from '@react-three/drei'
import { useTheme } from '../hooks/useTheme'

class ThreeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false } }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

function Particles({ count = 80, isDark }) {
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
        size={isDark ? 0.1 : 0.12}
        color={isDark ? 0xc8102e : 0xb00e28}
        sizeAttenuation
        transparent
        opacity={isDark ? 0.5 : 0.35}
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
        /* Dark mode: dark mesh with red glow */
        <meshPhongMaterial
          color={0x1a1a1a}
          wireframe
          emissive={0xc8102e}
          emissiveIntensity={0.15}
        />
      ) : (
        /* Light mode: warm parchment mesh with very subtle red tint — nearly invisible, depth only */
        <meshPhongMaterial
          color={0xe8d0c4}
          wireframe
          emissive={0xc8102e}
          emissiveIntensity={0.04}
          opacity={0.18}
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
          <ambientLight intensity={isDark ? 0.15 : 0.7} />
          <pointLight
            position={[20, 20, 20]}
            intensity={isDark ? 0.35 : 0.3}
            color={0xc8102e}
          />
          <pointLight
            position={[-20, -20, -20]}
            intensity={isDark ? 0.2 : 0.15}
            color={isDark ? 0x666666 : 0xd4a89a}
          />
          <Particles count={80} isDark={isDark} />
          <FloatingMesh isDark={isDark} />
          {/* Stars only in dark mode — look wrong on light bg */}
          {isDark && (
            <Stars radius={100} depth={50} count={500} factor={4} fade speed={0.1} />
          )}
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  )
}
