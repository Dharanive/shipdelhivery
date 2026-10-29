'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RoboticArmProps {
  position?: [number, number, number]
  reducedMotion?: boolean
}

/**
 * 6-Axis Articulated Sorting Robot
 * Based on high-speed industrial warehouse palletizing & parcel-induction arms.
 */
export default function RoboticArm({
  position = [0, 0, 0],
  reducedMotion = false,
}: RoboticArmProps) {
  const baseRotRef = useRef<THREE.Group>(null)
  const shoulderRef = useRef<THREE.Group>(null)
  const elbowRef = useRef<THREE.Group>(null)
  const wristRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime() * 0.9

    // Base rotation sweep back and forth
    if (baseRotRef.current) {
      baseRotRef.current.rotation.y = Math.sin(t) * 0.55
    }
    // Shoulder flexion
    if (shoulderRef.current) {
      shoulderRef.current.rotation.z = -0.3 + Math.sin(t * 1.2) * 0.2
    }
    // Elbow compensation
    if (elbowRef.current) {
      elbowRef.current.rotation.z = 0.5 + Math.cos(t * 1.2) * 0.25
    }
    // Wrist adjustment
    if (wristRef.current) {
      wristRef.current.rotation.x = Math.sin(t * 2) * 0.15
    }
  })

  const ARM_ORANGE = '#EA580C'
  const JOINT_DARK = '#0F172A'
  const STEEL_GREY = '#475569'

  return (
    <group position={position}>
      {/* Heavy Steel Pedestal Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.2, 20]} />
        <meshStandardMaterial color={JOINT_DARK} roughness={0.6} metalness={0.7} />
      </mesh>
      {/* Anchor bolts circle */}
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i * Math.PI) / 3
        return (
          <mesh key={i} position={[Math.cos(ang) * 0.38, 0.21, Math.sin(ang) * 0.38]}>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
            <meshStandardMaterial color={STEEL_GREY} metalness={0.9} roughness={0.2} />
          </mesh>
        )
      })}

      {/* Rotating Turntable */}
      <group ref={baseRotRef} position={[0, 0.2, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.36, 0.16, 20]} />
          <meshStandardMaterial color={ARM_ORANGE} roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Shoulder Joint Bracket */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.26, 0.28, 0.32]} />
          <meshStandardMaterial color={JOINT_DARK} roughness={0.5} metalness={0.6} />
        </mesh>

        {/* Upper Arm Segment */}
        <group ref={shoulderRef} position={[0, 0.35, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.16, 0.85, 0.16]} />
            <meshStandardMaterial color={ARM_ORANGE} roughness={0.35} metalness={0.4} />
          </mesh>

          {/* Elbow Joint Pivot */}
          <group ref={elbowRef} position={[0, 0.85, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.24, 16]} />
              <meshStandardMaterial color={JOINT_DARK} roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Forearm Segment */}
            <mesh position={[0, 0.38, 0]} castShadow>
              <boxGeometry args={[0.13, 0.72, 0.13]} />
              <meshStandardMaterial color={ARM_ORANGE} roughness={0.35} metalness={0.4} />
            </mesh>

            {/* Wrist & End-Effector / Suction Gripper */}
            <group ref={wristRef} position={[0, 0.74, 0]}>
              <mesh position={[0, 0.06, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
                <meshStandardMaterial color={JOINT_DARK} roughness={0.5} metalness={0.8} />
              </mesh>
              {/* Vacuum Gripper Plate */}
              <mesh position={[0, 0.13, 0]} castShadow>
                <boxGeometry args={[0.22, 0.025, 0.22]} />
                <meshStandardMaterial color={STEEL_GREY} roughness={0.3} metalness={0.8} />
              </mesh>
              {/* 4 Rubber Suction Cups */}
              {[-0.07, 0.07].map((sx, sxi) =>
                [-0.07, 0.07].map((sz, szi) => (
                  <mesh key={`cup-${sxi}-${szi}`} position={[sx, 0.16, sz]}>
                    <cylinderGeometry args={[0.03, 0.02, 0.04, 12]} />
                    <meshStandardMaterial color="#1E293B" roughness={0.9} />
                  </mesh>
                ))
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

