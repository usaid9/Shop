import { Canvas } from '@react-three/fiber'
import { Stars, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'

function Particles({ count = 80 }) {
  const mesh = useRef(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      positions[i]     = (Math.random() - 0.5) * 40
      positions[i + 1] = (Math.random() - 0.5) * 40
      positions[i + 2] = (Math.random() - 0.5) * 40
    }
    return positions
  }, [count])

  useEffect(() => {
    let id
    const animate = () => {
      if (mesh.current?.geometry?.attributes?.position) {
        const arr = mesh.current.geometry.attributes.position.array
        for (let i = 1; i < arr.length; i += 3) {
          arr[i] -= 0.01
          if (arr[i] < -20) arr[i] = 20
        }
        mesh.current.geometry.attributes.position.needsUpdate = true
      }
      id = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={0xdc2626} sizeAttenuation transparent opacity={0.6} />
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
      <meshPhongMaterial color={0x1a1a1a} wireframe emissive={0xdc2626} emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function ThreeDBackground() {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      gl={{ antialias: true, alpha: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 30]} />
      <ambientLight intensity={0.4} color={0xffffff} />
      <pointLight position={[20, 20, 20]} intensity={0.8} color={0xdc2626} />
      <pointLight position={[-20, -20, -20]} intensity={0.4} color={0x666666} />
      <Particles count={80} />
      <FloatingMesh />
      <Stars radius={100} depth={50} count={500} factor={4} fade speed={0.1} />
    </Canvas>
  )
}
