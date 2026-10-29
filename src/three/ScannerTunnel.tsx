'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ScannerTunnelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  reducedMotion?: boolean
}

/**
 * High-speed Optical Scanner Tunnel inspired by modern logistics dimensioners
 * Features dark industrial housing, entrance curtain slats, amber indicators,
 * and an animated internal laser scanning plane.
 */
export default function ScannerTunnel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  reducedMotion = false,
}: ScannerTunnelProps) {
  const laserRef = useRef<THREE.Mesh>(null)
  const indicatorRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    // Oscillating laser scan plane
    if (laserRef.current) {
      const mat = laserRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.4 + 0.35 * Math.sin(t * 5)
    }
    // Pulsing indicator light
    if (indicatorRef.current) {
      const indMat = indicatorRef.current.material as THREE.MeshStandardMaterial
      indMat.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 3)
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Scanner Main Housing */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.2, 1.0]} />
        <meshStandardMaterial color="#141E2E" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Internal tunnel cutout (inner dark cavity) */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.78, 0.85, 1.02]} />
        <meshStandardMaterial color="#080D1A" roughness={0.8} />
      </mesh>

      {/* Top chamfer / sensor pod */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <boxGeometry args={[0.8, 0.12, 0.7]} />
        <meshStandardMaterial color="#1E2E48" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Status indicator button (amber/orange circle) */}
      <mesh ref={indicatorRef} position={[-0.42, 1.25, 0.51]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
        <meshStandardMaterial
          color="#FB923C"
          emissive="#FB923C"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Optical lens / white status sensor */}
      <mesh position={[-0.42, 1.12, 0.51]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        <meshStandardMaterial
          color="#E2E8F0"
          emissive="#FFFFFF"
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Front Entrance Rubber Curtain Slats (flexible PVC strips) */}
      {[-0.28, -0.14, 0, 0.14, 0.28].map((x, i) => (
        <mesh key={`curtain-f-${i}`} position={[x, 0.78, 0.5]} rotation={[0.08 * (i % 2 === 0 ? 1 : -1), 0, 0]}>
          <boxGeometry args={[0.11, 0.65, 0.015]} />
          <meshStandardMaterial color="#111827" roughness={0.9} transparent opacity={0.88} />
        </mesh>
      ))}

      {/* Rear Exit Rubber Curtain Slats */}
      {[-0.28, -0.14, 0, 0.14, 0.28].map((x, i) => (
        <mesh key={`curtain-r-${i}`} position={[x, 0.78, -0.5]} rotation={[-0.08 * (i % 2 === 0 ? 1 : -1), 0, 0]}>
          <boxGeometry args={[0.11, 0.65, 0.015]} />
          <meshStandardMaterial color="#111827" roughness={0.9} transparent opacity={0.88} />
        </mesh>
      ))}

      {/* Internal Laser Scanning Sheet */}
      <mesh ref={laserRef} position={[0, 0.72, 0]}>
        <planeGeometry args={[0.74, 0.8]} />
        <meshStandardMaterial
          color="#FB923C"
          emissive="#FB923C"
          emissiveIntensity={1.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Laser point light casting glow onto conveyor */}
      <pointLight position={[0, 0.85, 0]} color="#FB923C" intensity={1.5} distance={1.8} decay={2} />

      {/* Steel structural support legs */}
      {[-0.5, 0.5].map((x, xi) =>
        [-0.45, 0.45].map((z, zi) => (
          <mesh key={`leg-${xi}-${zi}`} position={[x, 0.18, z]} castShadow>
            <boxGeometry args={[0.06, 0.36, 0.06]} />
            <meshStandardMaterial color="#0F172A" roughness={0.6} metalness={0.7} />
          </mesh>
        ))
      )}
    </group>
  )
}

