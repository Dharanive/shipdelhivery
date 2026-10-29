'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export type WarehouseZoneId = 'all' | 'intake' | 'sorting' | 'racks' | 'dispatch'

interface WarehouseCameraProps {
  activeZone: WarehouseZoneId
  reducedMotion?: boolean
}

// Target configurations for each zone
const ZONE_TARGETS: Record<
  WarehouseZoneId,
  { pos: [number, number, number]; lookAt: [number, number, number]; zoomMultiplier: number }
> = {
  all: {
    pos: [14, 16, 14],
    lookAt: [0, 0, 0],
    zoomMultiplier: 1.0,
  },
  intake: {
    pos: [-2, 13, 14],
    lookAt: [-6.5, 0.5, 3],
    zoomMultiplier: 1.35,
  },
  sorting: {
    pos: [9, 13, 9],
    lookAt: [1.2, 0.5, -0.5],
    zoomMultiplier: 1.35,
  },
  racks: {
    pos: [-2, 14, 1],
    lookAt: [-5.5, 1.2, -4],
    zoomMultiplier: 1.4,
  },
  dispatch: {
    pos: [13, 13, 11],
    lookAt: [5.2, 0.5, 3.8],
    zoomMultiplier: 1.35,
  },
}

export default function WarehouseCamera({
  activeZone = 'all',
  reducedMotion = false,
}: WarehouseCameraProps) {
  const { camera, size } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const targetPos = useRef(new THREE.Vector3(14, 16, 14))

  // Base zoom adapted to screen width for compact mobile composition
  const baseZoom = Math.min(Math.max((size.width / 1440) * 40, 22), 44)

  useEffect(() => {
    if (reducedMotion) return
    const handlePointerMove = (e: MouseEvent) => {
      // Normalized coordinates (-1 to 1)
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('mousemove', handlePointerMove)
  }, [reducedMotion])

  useFrame((_, delta) => {
    const config = ZONE_TARGETS[activeZone] ?? ZONE_TARGETS.all
    const orthoCam = camera as THREE.OrthographicCamera

    // Calculate target position with subtle parallax offset
    const parallaxX = reducedMotion ? 0 : mouseRef.current.x * 0.9
    const parallaxZ = reducedMotion ? 0 : mouseRef.current.y * 0.9

    targetPos.current.set(
      config.pos[0] + parallaxX,
      config.pos[1],
      config.pos[2] + parallaxZ
    )
    targetLookAt.current.set(...config.lookAt)

    // Smooth lerp camera position
    const speed = reducedMotion ? 1 : Math.min(delta * 4, 0.2)
    camera.position.lerp(targetPos.current, speed)
    currentLookAt.current.lerp(targetLookAt.current, speed)
    camera.lookAt(currentLookAt.current)

    // Smooth lerp zoom
    const targetZoom = baseZoom * config.zoomMultiplier
    orthoCam.zoom = THREE.MathUtils.lerp(orthoCam.zoom, targetZoom, speed)
    orthoCam.updateProjectionMatrix()
  })

  return null
}

