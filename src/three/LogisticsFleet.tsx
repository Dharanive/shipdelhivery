'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Shared Fleet Palette: Royal Cobalt Blue, Navy, Clean White, Dark Rubber, Chrome
const FLEET_BLUE = '#1D4ED8'
const FLEET_NAVY = '#0F172A'
const FLEET_WHITE = '#FFFFFF'
const TIRE_COLOR = '#1E293B'
const CHROME_COLOR = '#E2E8F0'

/**
 * 1. Heavy Articulated Semi-Trailer (Class 8 Tractor + 53ft Container)
 */
export function ArticulatedSemiTruck({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isMoving = false,
  wheelSpeed = 1,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  isMoving?: boolean
  wheelSpeed?: number
}) {
  const wheelsRef = useRef<THREE.Mesh[]>([])

  useFrame((_, delta) => {
    if (!isMoving) return
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x -= delta * 10 * wheelSpeed
    })
  })

  return (
    <group position={position} rotation={rotation}>
      {/* ── Cab Tractor ── */}
      <group position={[0, 0, 1.8]}>
        {/* Lower Cab Body */}
        <mesh position={[0, 0.78, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.05, 1.3]} />
          <meshStandardMaterial color={FLEET_BLUE} roughness={0.25} metalness={0.2} />
        </mesh>
        {/* Aerodynamic High Roof Fairing */}
        <mesh position={[0, 1.55, 0.28]} castShadow>
          <boxGeometry args={[1.32, 0.52, 1.05]} />
          <meshStandardMaterial color={FLEET_BLUE} roughness={0.2} />
        </mesh>
        {/* Front Black Mask & Radiator Grille */}
        <mesh position={[0, 0.65, 1.06]}>
          <boxGeometry args={[1.1, 0.55, 0.04]} />
          <meshStandardMaterial color={FLEET_NAVY} roughness={0.6} />
        </mesh>
        {[-0.14, -0.02, 0.1].map((y, i) => (
          <mesh key={`grille-${i}`} position={[0, 0.65 + y, 1.085]}>
            <boxGeometry args={[0.96, 0.04, 0.02]} />
            <meshStandardMaterial color={CHROME_COLOR} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Wrap-around Tinted Windshield */}
        <mesh position={[0, 1.32, 0.88]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[1.26, 0.58, 0.04]} />
          <meshStandardMaterial color="#0B132B" roughness={0.05} metalness={0.9} transparent opacity={0.92} />
        </mesh>
        {/* Side Windows */}
        {[-0.69, 0.69].map((x, i) => (
          <mesh key={`cab-win-${i}`} position={[x, 1.32, 0.4]}>
            <boxGeometry args={[0.02, 0.48, 0.65]} />
            <meshStandardMaterial color="#0B132B" roughness={0.05} metalness={0.9} />
          </mesh>
        ))}
        {/* LED Headlights */}
        {[-0.48, 0.48].map((x, i) => (
          <mesh key={`headlight-${i}`} position={[x, 0.52, 1.08]}>
            <boxGeometry args={[0.22, 0.14, 0.03]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#BAE6FD" emissiveIntensity={1.2} />
          </mesh>
        ))}
        {/* Dual Side Mirrors */}
        {[-0.78, 0.78].map((x, i) => (
          <group key={`mirror-${i}`} position={[x, 1.25, 0.7]}>
            <mesh>
              <boxGeometry args={[0.04, 0.26, 0.12]} />
              <meshStandardMaterial color={FLEET_NAVY} roughness={0.3} />
            </mesh>
            <mesh position={[x > 0 ? -0.05 : 0.05, 0, -0.04]}>
              <boxGeometry args={[0.09, 0.025, 0.025]} />
              <meshStandardMaterial color={FLEET_NAVY} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 53ft Container Trailer ── */}
      <group position={[0, 0, -0.7]}>
        {/* Container Main Shell (Two-Tone Royal Blue & Crisp White) */}
        <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.44, 1.55, 3.8]} />
          <meshStandardMaterial color={FLEET_WHITE} roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Lower Blue Banner Stripe */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.45, 0.55, 3.82]} />
          <meshStandardMaterial color={FLEET_BLUE} roughness={0.25} />
        </mesh>
        {/* Roof Corrugation Ribs */}
        {[-1.6, -1.0, -0.4, 0.2, 0.8, 1.4].map((z, i) => (
          <mesh key={`rib-${i}`} position={[0, 2.14, z]}>
            <boxGeometry args={[1.4, 0.03, 0.1]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.5} />
          </mesh>
        ))}
        {/* Rear Container Doors */}
        <mesh position={[0, 1.35, -1.91]}>
          <boxGeometry args={[1.4, 1.48, 0.03]} />
          <meshStandardMaterial color={FLEET_NAVY} roughness={0.4} />
        </mesh>
        {/* Chrome Door Locking Rods */}
        {[-0.26, 0.26].map((x, i) => (
          <mesh key={`rod-${i}`} position={[x, 1.35, -1.93]}>
            <boxGeometry args={[0.025, 1.25, 0.02]} />
            <meshStandardMaterial color={CHROME_COLOR} metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
      </group>

      {/* ── Steel Chassis Frame ── */}
      <mesh position={[0, 0.38, 0.4]} castShadow>
        <boxGeometry args={[1.1, 0.16, 5.2]} />
        <meshStandardMaterial color={FLEET_NAVY} roughness={0.7} metalness={0.6} />
      </mesh>

      {/* ── 5 Axles / 10 Wheels ── */}
      {[
        { z: 2.3, label: 'steer' },
        { z: 0.9, label: 'drive-1' },
        { z: 0.2, label: 'drive-2' },
        { z: -1.8, label: 'trailer-1' },
        { z: -2.4, label: 'trailer-2' },
      ].flatMap(({ z }, axIdx) =>
        [-0.8, 0.8].map((x, sIdx) => {
          const idx = axIdx * 2 + sIdx
          return (
            <group key={`semi-whl-${idx}`} position={[x, 0.35, z]}>
              <mesh
                rotation={[0, 0, Math.PI / 2]}
                ref={(el) => {
                  if (el) wheelsRef.current[idx] = el
                }}
                castShadow
              >
                <cylinderGeometry args={[0.35, 0.35, 0.22, 20]} />
                <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.23, 12]} />
                <meshStandardMaterial color={CHROME_COLOR} metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )
        })
      )}
    </group>
  )
}

/**
 * 2. Medium Box Delivery Truck (Class 6 Rigid Freight Truck)
 */
export function MediumBoxTruck({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isMoving = false,
  wheelSpeed = 1,
  color = FLEET_BLUE,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  isMoving?: boolean
  wheelSpeed?: number
  color?: string
}) {
  const wheelsRef = useRef<THREE.Mesh[]>([])

  useFrame((_, delta) => {
    if (!isMoving) return
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x -= delta * 12 * wheelSpeed
    })
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Cargo Box */}
      <mesh position={[0, 1.15, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.28, 1.28, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} />
      </mesh>
      {/* White Accent Roof Cap */}
      <mesh position={[0, 1.82, -0.4]} castShadow>
        <boxGeometry args={[1.26, 0.08, 2.48]} />
        <meshStandardMaterial color={FLEET_WHITE} roughness={0.3} />
      </mesh>
      {/* Rear Roll-up Door */}
      <mesh position={[0, 1.1, -1.66]}>
        <boxGeometry args={[1.15, 1.15, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Cab Body */}
      <group position={[0, 0, 1.3]}>
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[1.24, 0.95, 0.95]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.95, 0.44]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[1.16, 0.46, 0.03]} />
          <meshStandardMaterial color="#0B132B" roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Front Bumper & Headlights */}
        <mesh position={[0, 0.42, 0.48]}>
          <boxGeometry args={[1.22, 0.22, 0.04]} />
          <meshStandardMaterial color={FLEET_NAVY} roughness={0.5} />
        </mesh>
        {[-0.42, 0.42].map((x, i) => (
          <mesh key={`med-head-${i}`} position={[x, 0.45, 0.51]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#BAE6FD" emissiveIntensity={1.2} />
          </mesh>
        ))}
      </group>

      {/* Chassis Frame */}
      <mesh position={[0, 0.32, 0.3]} castShadow>
        <boxGeometry args={[0.95, 0.14, 3.4]} />
        <meshStandardMaterial color={FLEET_NAVY} roughness={0.8} />
      </mesh>

      {/* 2 Axles / 4 Wheels */}
      {[1.2, -1.0].flatMap((z, aIdx) =>
        [-0.72, 0.72].map((x, sIdx) => {
          const idx = aIdx * 2 + sIdx
          return (
            <group key={`med-whl-${idx}`} position={[x, 0.3, z]}>
              <mesh
                rotation={[0, 0, Math.PI / 2]}
                ref={(el) => {
                  if (el) wheelsRef.current[idx] = el
                }}
                castShadow
              >
                <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
                <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.14, 0.14, 0.19, 10]} />
                <meshStandardMaterial color={CHROME_COLOR} metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )
        })
      )}
    </group>
  )
}

/**
 * 3. Compact Parcel Delivery Van (Modern Urban Electric Van)
 */
export function UrbanDeliveryVan({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isMoving = false,
  wheelSpeed = 1,
  color = FLEET_WHITE,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  isMoving?: boolean
  wheelSpeed?: number
  color?: string
}) {
  const wheelsRef = useRef<THREE.Mesh[]>([])

  useFrame((_, delta) => {
    if (!isMoving) return
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x -= delta * 15 * wheelSpeed
    })
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Aerodynamic Van Body */}
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.88, 2.0]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Front Sloped Hood */}
      <mesh position={[0, 0.48, 1.15]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.92, 0.38, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Large Curved Windshield */}
      <mesh position={[0, 0.82, 0.92]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.88, 0.45, 0.02]} />
        <meshStandardMaterial color="#0B132B" roughness={0.05} metalness={0.9} />
      </mesh>
      {/* Dual Headlights Bar */}
      <mesh position={[0, 0.4, 1.38]}>
        <boxGeometry args={[0.85, 0.08, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#BAE6FD" emissiveIntensity={1.5} />
      </mesh>
      {/* Side Blue Fleet Decal */}
      {[-0.485, 0.485].map((x, i) => (
        <mesh key={`van-decal-${i}`} position={[x, 0.72, -0.1]}>
          <boxGeometry args={[0.01, 0.16, 1.2]} />
          <meshStandardMaterial color={FLEET_BLUE} roughness={0.3} />
        </mesh>
      ))}

      {/* 4 Wheels */}
      {[0.75, -0.65].flatMap((z, aIdx) =>
        [-0.52, 0.52].map((x, sIdx) => {
          const idx = aIdx * 2 + sIdx
          return (
            <mesh
              key={`van-whl-${idx}`}
              position={[x, 0.22, z]}
              rotation={[0, 0, Math.PI / 2]}
              ref={(el) => {
                if (el) wheelsRef.current[idx] = el
              }}
              castShadow
            >
              <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
              <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
            </mesh>
          )
        })
      )}
    </group>
  )
}

