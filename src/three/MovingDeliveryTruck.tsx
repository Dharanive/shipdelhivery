'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MovingDeliveryTruckProps {
  initialOffset?: number
  speedMultiplier?: number
  reducedMotion?: boolean
  label?: string
}

// Road spline path looping around the warehouse facility:
// 1. Starts from warehouse loading bay dock A
// 2. Drives down the access ramp to the main road
// 3. Cruising along the main arterial roadway
// 4. Turns into the outbound dispatch checkpoint
// 5. Loops back to the transit receiving lane
export const ROAD_POINTS: [number, number, number][] = [
  [-10, 0, 4.2],   // At Loading Bay Dock
  [-6, 0, 4.2],    // Pulling away from dock
  [-2, 0, 4.2],    // Approaching main roadway
  [3, 0, 3.8],     // Curving onto boulevard
  [8, 0, 1.5],     // Cruising along east road
  [9.5, 0, -3.5],  // Approaching transit corner
  [7, 0, -7.5],    // North corridor
  [1, 0, -8.2],    // Behind warehouse storage
  [-6, 0, -7.8],   // Northwest transit return
  [-11, 0, -4.5],  // West perimeter
  [-11, 0, 1.5],   // Turning back into inbound dock
]

export default function MovingDeliveryTruck({
  initialOffset = 0,
  speedMultiplier = 1,
  reducedMotion = false,
  label = 'SHIPDELHIVERY',
}: MovingDeliveryTruckProps) {
  const truckRef = useRef<THREE.Group>(null)
  const wheelRefs = useRef<THREE.Mesh[]>([])
  const progressRef = useRef(initialOffset)

  const curve = useMemo(() => {
    const vectors = ROAD_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    return new THREE.CatmullRomCurve3(vectors, true) // Closed circuit loop
  }, [])

  // Create subtle road decal/container side canvas texture
  const containerDecal = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#1D4ED8'
    ctx.fillRect(0, 0, 512, 128)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, 256, 64)
    ctx.fillStyle = '#38BDF8'
    ctx.fillRect(40, 100, 432, 6)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [label])

  useFrame((_, delta) => {
    if (reducedMotion || !truckRef.current) return

    // Advance truck position along road circuit
    const speed = 0.035 * speedMultiplier
    progressRef.current = (progressRef.current + delta * speed) % 1
    const t = progressRef.current

    const pos = curve.getPoint(t)
    const tangent = curve.getTangent(t)

    truckRef.current.position.set(pos.x, pos.y, pos.z)

    // Smoothly orient truck in direction of travel
    const angle = Math.atan2(tangent.x, tangent.z)
    truckRef.current.rotation.y = angle

    // Spin wheels
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x -= delta * 12 * speedMultiplier
    })
  })

  const ROYAL_BLUE = '#1D4ED8'
  const CHASSIS_DARK = '#0F172A'
  const TIRE_BLACK = '#1E293B'
  const CHROME = '#CBD5E1'

  return (
    <group ref={truckRef}>
      {/* ───────────────────────────────────────────────────────────
          Trailer Container (Vibrant Royal Cobalt Blue)
      ──────────────────────────────────────────────────────────── */}
      <mesh position={[0, 1.25, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.45, 3.4]} />
        <meshStandardMaterial
          color={ROYAL_BLUE}
          map={containerDecal ?? undefined}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>

      {/* Container Roof Ribs (aerodynamic details) */}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((z, i) => (
        <mesh key={`rib-${i}`} position={[0, 2.0, z - 0.6]}>
          <boxGeometry args={[1.46, 0.04, 0.08]} />
          <meshStandardMaterial color="#1E40AF" roughness={0.4} />
        </mesh>
      ))}

      {/* Container Rear Doors & Locking Bars */}
      <mesh position={[0, 1.25, -2.31]}>
        <boxGeometry args={[1.46, 1.4, 0.03]} />
        <meshStandardMaterial color="#1E3A8A" roughness={0.4} />
      </mesh>
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={`lock-${i}`} position={[x, 1.25, -2.33]}>
          <boxGeometry args={[0.03, 1.2, 0.02]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* ───────────────────────────────────────────────────────────
          Cabin (Crisp White & Royal Blue Two-Tone)
      ──────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 1.5]}>
        {/* Cab Lower Body */}
        <mesh position={[0, 0.85, 0.4]} castShadow>
          <boxGeometry args={[1.48, 1.1, 1.2]} />
          <meshStandardMaterial color={ROYAL_BLUE} roughness={0.25} metalness={0.15} />
        </mesh>

        {/* Cab Upper / Roof Wind Deflector */}
        <mesh position={[0, 1.6, 0.3]} castShadow>
          <boxGeometry args={[1.44, 0.5, 1.0]} />
          <meshStandardMaterial color={ROYAL_BLUE} roughness={0.2} />
        </mesh>

        {/* Front Grille */}
        <mesh position={[0, 0.72, 1.01]}>
          <boxGeometry args={[1.1, 0.5, 0.03]} />
          <meshStandardMaterial color="#0B1220" roughness={0.6} />
        </mesh>
        {/* Grille chrome bars */}
        {[-0.12, 0, 0.12].map((y, i) => (
          <mesh key={`grille-bar-${i}`} position={[0, 0.72 + y, 1.025]}>
            <boxGeometry args={[1.0, 0.03, 0.02]} />
            <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Windshield Glass */}
        <mesh position={[0, 1.35, 0.82]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[1.34, 0.65, 0.03]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.05}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Side Windows */}
        {[-0.75, 0.75].map((x, i) => (
          <mesh key={`side-win-${i}`} position={[x, 1.35, 0.35]}>
            <boxGeometry args={[0.02, 0.55, 0.7]} />
            <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.9} />
          </mesh>
        ))}

        {/* LED Headlights */}
        {[-0.55, 0.55].map((x, i) => (
          <mesh key={`light-${i}`} position={[x, 0.6, 1.02]}>
            <boxGeometry args={[0.26, 0.16, 0.04]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#E0F2FE"
              emissiveIntensity={1.4}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Aerodynamic Side Mirrors */}
        {[-0.82, 0.82].map((x, i) => (
          <group key={`mirror-${i}`} position={[x, 1.25, 0.7]}>
            <mesh>
              <boxGeometry args={[0.04, 0.28, 0.14]} />
              <meshStandardMaterial color="#0B1220" roughness={0.4} />
            </mesh>
            <mesh position={[x > 0 ? -0.05 : 0.05, 0, -0.05]}>
              <boxGeometry args={[0.1, 0.03, 0.03]} />
              <meshStandardMaterial color="#0B1220" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────
          Chassis & Wheels (3 Axles: 1 Front, 2 Rear)
      ──────────────────────────────────────────────────────────── */}
      {/* Heavy Steel Chassis Rail */}
      <mesh position={[0, 0.35, 0.1]} castShadow>
        <boxGeometry args={[1.2, 0.2, 4.8]} />
        <meshStandardMaterial color={CHASSIS_DARK} roughness={0.7} metalness={0.8} />
      </mesh>

      {/* 6 Heavy Wheels with Chrome Rims */}
      {[
        { z: 1.8, label: 'front' },
        { z: -1.2, label: 'rear-1' },
        { z: -2.0, label: 'rear-2' },
      ].flatMap(({ z }, axleIndex) =>
        [-0.85, 0.85].map((x, sideIndex) => {
          const keyIndex = axleIndex * 2 + sideIndex
          return (
            <group key={`wheel-grp-${keyIndex}`} position={[x, 0.36, z]}>
              {/* Rubber Tire */}
              <mesh
                rotation={[0, 0, Math.PI / 2]}
                ref={(el) => {
                  if (el) wheelRefs.current[keyIndex] = el
                }}
                castShadow
              >
                <cylinderGeometry args={[0.36, 0.36, 0.22, 24]} />
                <meshStandardMaterial color={TIRE_BLACK} roughness={0.85} />
              </mesh>
              {/* Chrome Hub / Rim */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 0.23, 16]} />
                <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          )
        })
      )}
    </group>
  )
}

