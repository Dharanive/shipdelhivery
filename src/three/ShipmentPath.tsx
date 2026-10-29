'use client'

// ShipmentPath — utility for reusable path definitions
// The actual path is defined in Parcel.tsx and exported as PATH_POINTS
// This file provides visualization helpers

import { useMemo } from 'react'
import * as THREE from 'three'
import { PATH_POINTS } from './Parcel'

export default function ShipmentPath({ visible = false }: { visible?: boolean }) {
  const points = useMemo(
    () => PATH_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    []
  )

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, true), [points])
  const tubePoints = useMemo(() => curve.getPoints(80), [curve])

  if (!visible) return null

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(tubePoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#38BDF8" transparent opacity={0.3} />
    </line>
  )
}

