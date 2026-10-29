'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SortingStationProps {
  position?: [number, number, number]
}

export default function SortingStation({ position = [0, 0, 0] }: SortingStationProps) {
  const scannerRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)

  // Pulsing orange scan glow
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.5)
      glowRef.current.intensity = pulse * 1.2
    }
    if (scannerRef.current) {
      const mat = scannerRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.3 + 0.3 * Math.sin(clock.elapsedTime * 2.5)
    }
  })

  return (
    <group position={position}>
      {/* Main body */}
      <mesh position={[0, 0.8, 0.1]} castShadow>
        <boxGeometry args={[0.8, 1.6, 0.7]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Screen panel (front face) */}
      <mesh position={[0, 1.1, 0.45]}>
        <boxGeometry args={[0.55, 0.45, 0.02]} />
        <meshStandardMaterial color="#0D1B30" roughness={0.3} metalness={0.8} emissive="#38BDF8" emissiveIntensity={0.3} />
      </mesh>

      {/* Orange accent button */}
      <mesh position={[0.2, 0.55, 0.46]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#FB923C" roughness={0.3} emissive="#FB923C" emissiveIntensity={0.5} />
      </mesh>

      {/* Status dot */}
      <mesh position={[-0.2, 0.55, 0.46]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#22C55E" roughness={0.3} emissive="#22C55E" emissiveIntensity={0.8} />
      </mesh>

      {/* Scan laser bar */}
      <mesh ref={scannerRef} position={[0, 0.63, 0.47]}>
        <boxGeometry args={[0.65, 0.03, 0.01]} />
        <meshStandardMaterial
          color="#FB923C"
          emissive="#FB923C"
          emissiveIntensity={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Orange scan glow */}
      <pointLight ref={glowRef} position={[0, 0.63, 0.6]} color="#FB923C" intensity={1} distance={2} decay={2} />

      {/* Arm extending to conveyor */}
      <mesh position={[0, 0.63, -0.15]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color="#142238" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Feet / base */}
      {[-0.3, 0.3].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0.06, 0.1]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.5]} />
          <meshStandardMaterial color="#0C1A2E" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

