'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WarehouseZoneId } from './WarehouseCamera'

interface WarehouseFloorProps {
  activeZone?: WarehouseZoneId
}

interface ZoneMarker {
  id: WarehouseZoneId
  label: string
  center: [number, number] // x, z
  size: [number, number]   // width, length
  color: string
}

export const ZONES: ZoneMarker[] = [
  {
    id: 'intake',
    label: 'Zone A · Inbound Dock',
    center: [-7.5, 3.2],
    size: [4.8, 5.2],
    color: '#38BDF8',
  },
  {
    id: 'sorting',
    label: 'Zone B · Automated Sorter',
    center: [1.2, -0.5],
    size: [7.2, 6.4],
    color: '#FB923C',
  },
  {
    id: 'racks',
    label: 'Zone C · High-Bay Storage',
    center: [-5.6, -4.4],
    size: [5.8, 5.4],
    color: '#38BDF8',
  },
  {
    id: 'dispatch',
    label: 'Zone D · Outbound Linehaul',
    center: [5.2, 4.2],
    size: [5.2, 4.6],
    color: '#22C55E',
  },
]

export default function WarehouseFloor({ activeZone = 'all' }: WarehouseFloorProps) {
  const pulseRef = useRef<number>(0)
  const zoneMats = useRef<Map<string, THREE.MeshBasicMaterial>>(new Map())

  // Create floor texture with zone lines and industrial floor patterns
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const size = 1024
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Base concrete floor — clean stylized tone
    ctx.fillStyle = '#E5E0D8'
    ctx.fillRect(0, 0, size, size)

    // Secondary concrete tiles
    ctx.strokeStyle = '#D2CCC0'
    ctx.lineWidth = 1.5
    const step = size / 16
    for (let x = 0; x <= size; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke()
    }
    for (let y = 0; y <= size; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke()
    }

    // Pedestrian walkways (two-tone hazard stripes)
    const drawWalkway = (x: number, y: number, w: number, h: number) => {
      ctx.save()
      ctx.beginPath()
      ctx.rect(x, y, w, h)
      ctx.clip()
      ctx.fillStyle = '#CBD5E1'
      ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = '#94A3B8'
      ctx.lineWidth = 4
      for (let i = -h; i < w + h; i += 18) {
        ctx.beginPath()
        ctx.moveTo(x + i, y)
        ctx.lineTo(x + i + 12, y + h)
        ctx.stroke()
      }
      ctx.restore()
    }

    drawWalkway(size * 0.44, 0, 24, size)
    drawWalkway(0, size * 0.65, size, 24)

    // Safety yellow borders for loading docks
    ctx.fillStyle = '#F59E0B'
    ctx.globalAlpha = 0.35
    ctx.fillRect(16, size * 0.68, 140, 10)
    ctx.fillRect(size - 160, size * 0.72, 140, 10)
    ctx.globalAlpha = 1

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, 1)
    return tex
  }, [])

  useFrame(({ clock }) => {
    pulseRef.current = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 3)
    zoneMats.current.forEach((mat, id) => {
      if (activeZone === id || activeZone === 'all') {
        mat.opacity = activeZone === id ? 0.35 + 0.15 * pulseRef.current : 0.08
      } else {
        mat.opacity = 0.03
      }
    })
  })

  return (
    <group>
      {/* Main Floor Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? undefined : '#E5E0D8'}
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* Warehouse Back Wall (Cut-away architectural style) */}
      <mesh position={[0, 3.8, -10.5]} receiveShadow>
        <boxGeometry args={[32, 7.6, 0.3]} />
        <meshStandardMaterial color="#E8E4DC" roughness={0.95} />
      </mesh>
      {/* Structural wall columns */}
      {[-12, -6, 0, 6, 12].map((x) => (
        <mesh key={`col-${x}`} position={[x, 3.8, -10.3]} castShadow>
          <boxGeometry args={[0.5, 7.6, 0.25]} />
          <meshStandardMaterial color="#D1CAC0" roughness={0.8} />
        </mesh>
      ))}

      {/* Warehouse Left Wall */}
      <mesh position={[-11.5, 3.8, 0]} receiveShadow>
        <boxGeometry args={[0.3, 7.6, 32]} />
        <meshStandardMaterial color="#DFDAD1" roughness={0.95} />
      </mesh>

      {/* High-Bay Overhead Roof Truss Girder (industrial yellow steel) */}
      <mesh position={[0, 7.3, -2]} castShadow>
        <boxGeometry args={[23, 0.4, 0.6]} />
        <meshStandardMaterial color="#EAB308" roughness={0.4} metalness={0.7} />
      </mesh>
      {[-8, -2, 4, 10].map((x) => (
        <mesh key={`truss-${x}`} position={[x, 7.3, -6]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[8, 0.25, 0.3]} />
          <meshStandardMaterial color="#EAB308" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Interactive Zones Highlight Overlays */}
      {ZONES.map((zone) => {
        const isSelected = activeZone === zone.id
        return (
          <group key={zone.id} position={[zone.center[0], 0.005, zone.center[1]]}>
            {/* Zone floor tint plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[zone.size[0], zone.size[1]]} />
              <meshBasicMaterial
                ref={(el) => {
                  if (el) zoneMats.current.set(zone.id, el)
                }}
                color={zone.color}
                transparent
                opacity={0.08}
              />
            </mesh>

            {/* Zone boundary border line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <ringGeometry
                args={[
                  Math.min(zone.size[0], zone.size[1]) * 0.48,
                  Math.min(zone.size[0], zone.size[1]) * 0.5,
                  32,
                ]}
              />
              <meshBasicMaterial
                color={zone.color}
                transparent
                opacity={isSelected ? 0.8 : 0.25}
              />
            </mesh>

            {/* Floating zone indicator beacon if active */}
            {isSelected && (
              <pointLight
                position={[0, 1.2, 0]}
                color={zone.color}
                intensity={1.8}
                distance={4}
                decay={2}
              />
            )}
          </group>
        )
      })}
    </group>
  )
}
