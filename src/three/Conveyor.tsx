'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ConveyorProps {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  rollerColor?: string
  reducedMotion?: boolean
}

export default function Conveyor({
  start,
  end,
  color = '#142238',
  rollerColor = '#38BDF8',
  reducedMotion = false,
}: ConveyorProps) {
  const beltRef = useRef<THREE.Mesh>(null)

  // Derive belt geometry from start/end
  const startV = new THREE.Vector3(...start)
  const endV = new THREE.Vector3(...end)
  const direction = new THREE.Vector3().subVectors(endV, startV)
  const length = direction.length()
  const midpoint = new THREE.Vector3().addVectors(startV, endV).multiplyScalar(0.5)
  const angle = Math.atan2(direction.x, direction.z)

  // Belt height above floor
  const beltY = 0.55

  // Animate belt surface UV offset
  useFrame((_, delta) => {
    if (reducedMotion || !beltRef.current) return
    const mat = beltRef.current.material as THREE.MeshStandardMaterial
    if (mat.map) {
      mat.map.offset.y -= delta * 0.8
    }
  })

  // Create a simple striped belt texture
  const beltTexture = (() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 32, 64)
    // Stripes (roller segments)
    ctx.fillStyle = '#1E3A5F'
    for (let y = 0; y < 64; y += 8) {
      ctx.fillRect(0, y, 32, 2)
    }
    // Edge strips
    ctx.fillStyle = '#0EA5E9'
    ctx.fillRect(0, 0, 3, 64)
    ctx.fillRect(29, 0, 3, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, length * 0.5)
    return tex
  })()

  // Number of rollers to display
  const rollerCount = Math.floor(length / 0.5)
  const rollerRefs = useRef<THREE.Mesh[]>([])

  useFrame((_, delta) => {
    if (reducedMotion) return
    rollerRefs.current.forEach((r) => {
      if (r) r.rotation.x -= delta * 4
    })
  })

  return (
    <group position={[midpoint.x, beltY, midpoint.z]} rotation={[0, angle, 0]}>
      {/* Frame / chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.12, length]} />
        <meshStandardMaterial color="#0C1A2E" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Belt surface */}
      <mesh ref={beltRef} position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.6, 0.04, length]} />
        <meshStandardMaterial
          map={beltTexture ?? undefined}
          color={beltTexture ? undefined : color}
          roughness={0.8}
        />
      </mesh>

      {/* Rollers */}
      {Array.from({ length: rollerCount }).map((_, i) => {
        const zPos = -length / 2 + 0.25 + i * (length / rollerCount)
        return (
          <mesh
            key={i}
            position={[0, 0.06, zPos]}
            rotation={[0, 0, Math.PI / 2]}
            ref={(el) => { if (el) rollerRefs.current[i] = el }}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, 0.72, 8]} />
            <meshStandardMaterial color={rollerColor} roughness={0.5} metalness={0.4} />
          </mesh>
        )
      })}

      {/* Legs */}
      {[-length / 2 + 0.3, length / 2 - 0.3].map((zOff, i) => (
        <group key={i} position={[0, -0.35, zOff]}>
          {[-0.26, 0.26].map((xOff, j) => (
            <mesh key={j} position={[xOff, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 0.7, 0.06]} />
              <meshStandardMaterial color="#0C1A2E" roughness={0.6} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

