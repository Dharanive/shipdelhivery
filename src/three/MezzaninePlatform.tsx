'use client'

import * as THREE from 'three'

/**
 * Mezzanine platform with support pillars and safety yellow handrails
 * Recreates the elevated sorting deck seen in Reference Image 1.
 */
export default function MezzaninePlatform() {
  const STEEL_BEAM = '#1E3A5F'
  const DECK_COLOR = '#E2E8F0'
  const RAILING_YELLOW = '#F59E0B'

  return (
    <group position={[4.5, 0, -4.5]}>
      {/* Heavy Steel Support Columns */}
      {[
        [-3.2, 0, -2.5],
        [3.2, 0, -2.5],
        [-3.2, 0, 2.5],
        [3.2, 0, 2.5],
        [0, 0, -2.5],
        [0, 0, 2.5],
      ].map(([x, y, z], i) => (
        <group key={`col-${i}`} position={[x, 1.4, z]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.12, 2.8, 16]} />
            <meshStandardMaterial color={STEEL_BEAM} roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Base plate */}
          <mesh position={[0, -1.35, 0]}>
            <boxGeometry args={[0.35, 0.05, 0.35]} />
            <meshStandardMaterial color="#0B1220" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Main Floor Slab */}
      <mesh position={[0, 2.85, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 0.18, 5.8]} />
        <meshStandardMaterial color={DECK_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Edge Steel Frame Girder */}
      <mesh position={[0, 2.75, 2.85]} castShadow>
        <boxGeometry args={[7.25, 0.2, 0.1]} />
        <meshStandardMaterial color={STEEL_BEAM} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-3.55, 2.75, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 5.8]} />
        <meshStandardMaterial color={STEEL_BEAM} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Safety Yellow Perimeter Handrails */}
      {/* Front rail */}
      <group position={[0, 3.4, 2.85]}>
        <mesh castShadow>
          <boxGeometry args={[7.1, 0.04, 0.04]} />
          <meshStandardMaterial color={RAILING_YELLOW} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[7.1, 0.03, 0.03]} />
          <meshStandardMaterial color={RAILING_YELLOW} roughness={0.4} />
        </mesh>
        {/* Railing vertical posts */}
        {[-3.4, -1.7, 0, 1.7, 3.4].map((px, pi) => (
          <mesh key={`post-f-${pi}`} position={[px, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
            <meshStandardMaterial color={RAILING_YELLOW} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Left side rail */}
      <group position={[-3.55, 3.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.04, 0.04, 5.7]} />
          <meshStandardMaterial color={RAILING_YELLOW} roughness={0.4} />
        </mesh>
        {[-2.7, -0.9, 0.9, 2.7].map((pz, pi) => (
          <mesh key={`post-l-${pi}`} position={[0, -0.22, pz]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
            <meshStandardMaterial color={RAILING_YELLOW} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Pallet Stacks on Mezzanine Deck */}
      {[
        [-1.8, 3.1, -1.2],
        [-0.6, 3.1, -1.2],
        [1.2, 3.1, -1.4],
        [2.2, 3.1, -1.4],
      ].map(([x, y, z], i) => (
        <group key={`pallet-deck-${i}`} position={[x, y, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.5, 0.7]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#D4A574' : '#C8956A'} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

