'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// The belt path: follows the conveyor layout defined in WarehouseScene
const PATH_POINTS: [number, number, number][] = [
  [-8, 0.7, 2],   // Start (entering from loading area)
  [-4, 0.7, 2],   // Mid belt 1
  [0, 0.7, 2],    // Mid belt 2 — sorting station A
  [4, 0.7, 2],    // Turn point
  [4, 0.7, -1],   // Heading south
  [4, 0.7, -3],   // Sorting station B
  [1, 0.7, -3],   // Turn west
  [-2, 0.7, -3],  // Mid
  [-2, 0.7, -5],  // Exit spur
  [-2, 0.7, -7],  // Off-screen / loop back
]

interface ParcelProps {
  pathOffset?: number
  size?: [number, number, number]
  color?: string
  reducedMotion?: boolean
}

export default function Parcel({
  pathOffset = 0,
  size = [0.6, 0.45, 0.5],
  color = '#D4A574',
  reducedMotion = false,
}: ParcelProps) {
  const ref = useRef<THREE.Group>(null)
  const progressRef = useRef(pathOffset)

  const curve = useMemo(() => {
    const vectors = PATH_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    return new THREE.CatmullRomCurve3(vectors, true) // closed loop
  }, [])

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return
    progressRef.current = (progressRef.current + delta * 0.06) % 1
    const t = progressRef.current
    const pos = curve.getPoint(t)
    const tangent = curve.getTangent(t)
    ref.current.position.copy(pos)
    // Orient box to face direction of travel
    const angle = Math.atan2(tangent.x, tangent.z)
    ref.current.rotation.y = angle
  })

  // Create cardboard texture
  const cardboardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 64, 64)
    // Corrugation lines
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'
    ctx.lineWidth = 1
    for (let y = 0; y < 64; y += 4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(64, y); ctx.stroke()
    }
    // Edge seam
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'
    ctx.lineWidth = 2
    ctx.strokeRect(4, 4, 56, 56)
    // Tape stripe
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillRect(0, 28, 64, 8)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [color])

  return (
    <group ref={ref}>
      {/* Box body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          map={cardboardTexture ?? undefined}
          color={cardboardTexture ? undefined : color}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      {/* Tape strip on top */}
      <mesh position={[0, size[1] / 2 + 0.001, 0]}>
        <boxGeometry args={[size[0] * 0.25, 0.005, size[2]]} />
        <meshStandardMaterial color="#E0D8C0" roughness={0.4} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// ShipmentPath — exposed for potential reuse
export { PATH_POINTS }

