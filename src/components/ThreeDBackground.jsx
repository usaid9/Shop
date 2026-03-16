import { Component, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect, useMemo } from 'react'

class ThreeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false } }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

function Particles({ count = 80 }) {
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
      <pointsMaterial size={0.1} color={0xc8102e} sizeAttenuation transparent opacity={0.5} />
    </points>
  )
}

function FloatingMesh() {
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
      <meshPhongMaterial color={0x1a1a1a} wireframe emissive={0xc8102e} emissiveIntensity={0.15} />
    </mesh>
  )
}

export default function ThreeDBackground() {
  return (
    <ThreeErrorBoundary>
      <Suspense fallback={null}>
        <Canvas
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 30]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[20, 20, 20]} intensity={0.8} color={0xc8102e} />
          <pointLight position={[-20, -20, -20]} intensity={0.4} color={0x666666} />
          <Particles count={80} />
          <FloatingMesh />
          <Stars radius={100} depth={50} count={500} factor={4} fade speed={0.1} />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  )
}
