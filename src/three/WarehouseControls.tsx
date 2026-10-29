'use client'

import { useRef, useEffect, type ComponentRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls as DreiOrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { WarehouseZoneId } from './WarehouseCamera'

interface WarehouseControlsProps {
  activeZone: WarehouseZoneId
  autoRotate?: boolean
  reducedMotion?: boolean
}

type OrbitControlsHandle = ComponentRef<typeof DreiOrbitControls>

// Cinematic focus positions and targets for each zone
const ZONE_VIEWPOINTS: Record<
  WarehouseZoneId,
  { camPos: [number, number, number]; target: [number, number, number] }
> = {
  all: {
    camPos: [20, 18, 20],
    target: [0, 1.2, 0],
  },
  intake: {
    camPos: [-5, 11, 14],
    target: [-7.2, 0.8, 3.5],
  },
  sorting: {
    camPos: [10, 10, 9],
    target: [1.2, 0.8, -0.4],
  },
  racks: {
    camPos: [-4, 12, 4],
    target: [-6.2, 1.5, -4.2],
  },
  dispatch: {
    camPos: [15, 12, 12],
    target: [5.2, 0.8, 4.4],
  },
}

export default function WarehouseControls({
  activeZone = 'all',
  autoRotate = false,
  reducedMotion = false,
}: WarehouseControlsProps) {
  const controlsRef = useRef<OrbitControlsHandle>(null)
  const targetCamPos = useRef(new THREE.Vector3(20, 18, 20))
  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0))
  const isTransitioning = useRef(false)
  const transitionProgress = useRef(1)

  // Trigger smooth transition whenever activeZone changes
  useEffect(() => {
    const config = ZONE_VIEWPOINTS[activeZone] ?? ZONE_VIEWPOINTS.all
    targetCamPos.current.set(...config.camPos)
    targetLookAt.current.set(...config.target)
    isTransitioning.current = true
    transitionProgress.current = 0
  }, [activeZone])

  useFrame((state, delta) => {
    if (!controlsRef.current) return

    if (isTransitioning.current) {
      transitionProgress.current += delta * 1.8
      const t = Math.min(transitionProgress.current, 1)
      const easeT = THREE.MathUtils.smoothstep(t, 0, 1)

      state.camera.position.lerp(targetCamPos.current, easeT * 0.1)
      controlsRef.current.target.lerp(targetLookAt.current, easeT * 0.1)
      controlsRef.current.update()

      if (t >= 1) {
        isTransitioning.current = false
      }
    }
  })

  return (
    <DreiOrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={0.9}
      panSpeed={0.8}
      minDistance={6}
      maxDistance={46}
      maxPolarAngle={Math.PI / 2.05} // Prevent camera from going beneath floor
      minPolarAngle={Math.PI / 8}    // Prevent pure top-down disorientation
      autoRotate={autoRotate && !reducedMotion}
      autoRotateSpeed={0.7}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
    />
  )
}
