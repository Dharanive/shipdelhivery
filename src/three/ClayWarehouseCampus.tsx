'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Pristine architectural clay logistics campus
 * Inspired by reference images: clean studio clay buildings, loading bays,
 * asphalt roads with white dash markings, conveyor bridges, and low-poly landscaping.
 */
export default function ClayWarehouseCampus() {
  const CLAY_WHITE = '#FFFFFF'
  const CLAY_OFFWHITE = '#F1F5F9'
  const CLAY_SHADOW = '#E2E8F0'

  // Generate road texture with clean dashed center line
  const roadTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Base campus ground: soft pristine clay tone
    ctx.fillStyle = '#F8FAFC'
    ctx.fillRect(0, 0, 1024, 1024)

    // Architectural ground grid tiles
    ctx.strokeStyle = '#EEF2F6'
    ctx.lineWidth = 1.5
    const step = 64
    for (let x = 0; x <= 1024; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
    }
    for (let y = 0; y <= 1024; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
    }

    // Asphalt loop road
    ctx.fillStyle = '#E8EDF5'
    ctx.beginPath()
    ctx.ellipse(512, 512, 420, 360, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#F8FAFC'
    ctx.beginPath()
    ctx.ellipse(512, 512, 280, 240, 0, 0, Math.PI * 2)
    ctx.fill()

    // White dashed center line along road
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 6
    ctx.setLineDash([20, 18])
    ctx.beginPath()
    ctx.ellipse(512, 512, 350, 300, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [])

  return (
    <group>
      {/* ───────────────────────────────────────────────────────────
          1. Main Ground Base (Seamless Studio Clay)
      ──────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial
          map={roadTexture ?? undefined}
          color={roadTexture ? undefined : '#F8FAFC'}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────
          2. Main Logistics Distribution Center Building (Left)
      ──────────────────────────────────────────────────────────── */}
      <group position={[-10, 0, -1]}>
        {/* Main Warehouse Hall */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[7, 5, 10]} />
          <meshStandardMaterial color={CLAY_WHITE} roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Upper clerestory roof monitor */}
        <mesh position={[0, 5.4, 0]} castShadow>
          <boxGeometry args={[4.5, 0.8, 8.5]} />
          <meshStandardMaterial color={CLAY_OFFWHITE} roughness={0.3} />
        </mesh>

        {/* Loading Bay Docks (Roll-up Shutter Doors) */}
        {[
          { x: 3.51, z: 2.2, label: 'Bay 01' },
          { x: 3.51, z: -0.5, label: 'Bay 02' },
          { x: 3.51, z: -3.2, label: 'Bay 03' },
        ].map((bay, i) => (
          <group key={`dock-${i}`} position={[bay.x, 1.4, bay.z]}>
            {/* Shutter door recess */}
            <mesh>
              <boxGeometry args={[0.08, 2.6, 2.2]} />
              <meshStandardMaterial color="#0F172A" roughness={0.5} />
            </mesh>
            {/* Shutter horizontal slats */}
            {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((slatY, s) => (
              <mesh key={`slat-${s}`} position={[0.04, slatY, 0]}>
                <boxGeometry args={[0.03, 0.08, 2.1]} />
                <meshStandardMaterial color={CLAY_SHADOW} roughness={0.4} />
              </mesh>
            ))}
            {/* Dock weather seal canopy */}
            <mesh position={[0.4, 1.4, 0]} castShadow>
              <boxGeometry args={[0.8, 0.15, 2.5]} />
              <meshStandardMaterial color={CLAY_OFFWHITE} roughness={0.3} />
            </mesh>
            {/* Dock status light (Green active) */}
            <mesh position={[0.1, 1.55, 1.2]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#16A34A" emissive="#16A34A" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}

        {/* Building Signage "SHIPDELHIVERY" */}
        <mesh position={[3.52, 4.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[5, 0.6]} />
          <meshStandardMaterial color="#0B1220" roughness={0.2} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────
          3. Secondary Sortation Depot & Office (Right)
      ──────────────────────────────────────────────────────────── */}
      <group position={[7, 0, -4]}>
        {/* Depot Building */}
        <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.5, 4.0, 7.5]} />
          <meshStandardMaterial color={CLAY_WHITE} roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Slanted architectural roof canopy */}
        <mesh position={[0, 4.15, 0]} rotation={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[7.2, 0.3, 8.2]} />
          <meshStandardMaterial color={CLAY_OFFWHITE} roughness={0.25} />
        </mesh>

        {/* Dispatch portal opening */}
        <mesh position={[-3.26, 1.3, 0]}>
          <boxGeometry args={[0.06, 2.4, 3.6]} />
          <meshStandardMaterial color="#0B1220" roughness={0.8} />
        </mesh>

        {/* Rooftop HVAC & Solar Pods */}
        {[-1.5, 1.5].map((rx, ri) => (
          <mesh key={`hvac-${ri}`} position={[rx, 4.5, -1]} castShadow>
            <boxGeometry args={[1.2, 0.5, 1.6]} />
            <meshStandardMaterial color={CLAY_SHADOW} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────
          4. Overhead External Conveyor Loading Bridge (Image 1 style)
             Connecting warehouse directly to delivery truck!
      ──────────────────────────────────────────────────────────── */}
      <group position={[-5, 0, 2]}>
        {/* Bridge steel trusses */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[4.2, 0.2, 1.2]} />
          <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Conveyor belt surface */}
        <mesh position={[0, 1.95, 0]} castShadow>
          <boxGeometry args={[4.0, 0.08, 0.9]} />
          <meshStandardMaterial color="#0B1220" roughness={0.8} />
        </mesh>
        {/* Support columns */}
        {[-1.8, 1.8].map((cx, ci) => (
          <mesh key={`supp-${ci}`} position={[cx, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 1.8, 12]} />
            <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.7} />
          </mesh>
        ))}
        {/* Parcels gliding on the bridge */}
        {[-1.4, -0.4, 0.6, 1.5].map((px, pi) => (
          <mesh key={`bridge-box-${pi}`} position={[px, 2.18, 0]} castShadow>
            <boxGeometry args={[0.48, 0.38, 0.42]} />
            <meshStandardMaterial color={pi % 2 === 0 ? '#D4A574' : '#C8956A'} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────
          5. Low-Poly Minimalist Landscaping (Reference Image Cones & Trees)
      ──────────────────────────────────────────────────────────── */}
      {[
        [2, 0, -0.5],
        [2.8, 0, -1.2],
        [1.5, 0, -2.0],
        [8.5, 0, 3.5],
        [9.2, 0, 2.6],
        [-3.5, 0, -7.5],
        [-2.5, 0, -8.0],
      ].map(([tx, ty, tz], i) => (
        <group key={`tree-${i}`} position={[tx, ty, tz]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <coneGeometry args={[0.45, 1.5, 16]} />
            <meshStandardMaterial color={CLAY_WHITE} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
            <meshStandardMaterial color={CLAY_SHADOW} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ───────────────────────────────────────────────────────────
          6. Staged Stacks of Shipping Containers & Cargo
      ──────────────────────────────────────────────────────────── */}
      {/* Container Stack 1 */}
      <group position={[-11, 0, -7]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.6, 4.2]} />
          <meshStandardMaterial color="#0B1220" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.6, 4.2]} />
          <meshStandardMaterial color="#1D4ED8" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>

      {/* Container Stack 2 */}
      <group position={[11, 0, -7.5]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.6, 4.2]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

