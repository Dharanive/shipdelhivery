'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Palette Tokens Matching Reference Images ────────────────────────
const COLOR_CANVAS_BG   = '#F8FAFC' // Seamless studio white/clay
const COLOR_ROAD_DARK   = '#334155' // Clean slate asphalt
const COLOR_ROAD_APRON  = '#475569' // Loading apron concrete
const COLOR_CURB_WHITE  = '#E2E8F0' // Raised curb edges
const COLOR_LINE_WHITE  = '#FFFFFF' // Lane dashes
const COLOR_LINE_YELLOW = '#F59E0B' // Turning guidance lines
const COLOR_ACCENT_BLUE = '#38BDF8' // Electric blue dock guidance

// Architecture Palette
const COLOR_BLDG_NAVY   = '#1E293B' // Clean roof parapet
const COLOR_BLDG_WHITE  = '#FFFFFF' // Clean architectural walls
const COLOR_BLDG_CYAN   = '#0284C7' // Electric cyan entrance portals
const COLOR_BLDG_BLUE   = '#2563EB' // Cross-dock royal blue warehouse
const COLOR_ROOF_SLATE  = '#334155' // Main roof slate
const COLOR_SOLAR_BLUE  = '#1D4ED8' // Rooftop solar panels

// Fleet Palette (Consistent Stylized Blue-and-Navy)
const TRUCK_PRIMARY_BLUE = '#2563EB' // Rich polished royal blue
const TRUCK_DEEP_NAVY    = '#0F172A' // Dark midnight navy for bumpers, grilles, chassis
const TRUCK_ELECTRIC_CYAN= '#38BDF8' // Electric cyan accents / livery lines
const TRUCK_TRAILER_BODY = '#1D4ED8' // Rich dark blue trailer
const TRUCK_TRAILER_WHITE= '#FFFFFF' // Clean white contrast container
const TIRE_RUBBER        = '#0B1220' // Real rubber tire black
const WHEEL_HUB_CHROME   = '#E2E8F0' // Polished chrome wheel hub
const GLASS_TINT         = '#0B1220' // Deep reflective glass

// ── Continuous Connected Road Spline Paths ──
// Outer arterial circuit for Articulated Semi-Truck and Medium Truck
// Strictly centered on roadways, smoothly rounding all corners without collisions
export const CAMPUS_ROAD_CIRCUIT: [number, number, number][] = [
  [-9.6, 0, 4.2],   // Gatehouse Checkpoint
  [-5.0, 0, 4.2],   // Cruising Boulevard past Cross-Dock
  [1.0, 0, 4.2],    // Approaching Main Hub
  [6.5, 0, 4.2],    // East Boulevard approach
  [9.0, 0, 3.8],    // Southeast curve into Highway
  [10.2, 0, 1.5],   // East Highway northbound
  [10.2, 0, -3.5],  // East Highway past Super-Hub
  [10.2, 0, -6.8],  // Northeast approach
  [9.0, 0, -8.6],   // Northeast curve into bypass
  [4.5, 0, -8.8],   // North rear bypass corridor
  [-2.5, 0, -8.8],  // North bypass behind Cross-Dock
  [-7.5, 0, -8.8],  // Northwest approach
  [-9.2, 0, -8.2],  // Northwest curve into west link
  [-9.6, 0, -5.5],  // West transit link southbound
  [-9.6, 0, -1.0],  // West link past Cross-Dock
  [-9.6, 0, 2.0],   // Southwest link towards Gatehouse
]

// Secondary Delivery Loop: serving the Loading Apron & Cross-Dock
export const INNER_VAN_CIRCUIT: [number, number, number][] = [
  [-4.8, 0, 4.2],   // Boulevard entrance
  [-2.2, 0, 2.2],   // Turning onto Loading Apron
  [1.0, 0, 1.8],    // Passing staged vehicles
  [3.8, 0, 1.8],    // In front of Super-Hub Bay 01
  [3.8, 0, 0.4],    // Apron transit lane
  [-0.5, 0, 0.4],   // Heading west past sorting line
  [-3.8, 0, 0.6],   // Cross-Dock staging approach
  [-4.8, 0, 2.4],   // Merging back onto Boulevard
]

/**
 * ───────────────────────────────────────────────────────────────────
 * REUSABLE VEHICLE GEOMETRIES (Strictly grounded on road y = 0)
 * ───────────────────────────────────────────────────────────────────
 */
function SemiTrailerTruck({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  cabColor = TRUCK_PRIMARY_BLUE,
  trailerColor = TRUCK_TRAILER_BODY,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  cabColor?: string
  trailerColor?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* ── 1. CAB TRACTOR (Forward unit) ── */}
      <group position={[0, 0, 1.35]}>
        {/* Cab Lower Body with bevels */}
        <mesh position={[0, 0.72, 0.25]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.72, 1.1]} />
          <meshStandardMaterial color={cabColor} roughness={0.22} metalness={0.18} />
        </mesh>

        {/* Aerodynamic High-Roof Fairing */}
        <mesh position={[0, 1.28, 0.15]} castShadow>
          <boxGeometry args={[1.16, 0.42, 0.9]} />
          <meshStandardMaterial color={cabColor} roughness={0.2} metalness={0.15} />
        </mesh>

        {/* Navy Front Bumper */}
        <mesh position={[0, 0.42, 0.78]} castShadow>
          <boxGeometry args={[1.22, 0.28, 0.18]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
        </mesh>

        {/* Dark Radiator Intake Grille */}
        <mesh position={[0, 0.65, 0.81]}>
          <boxGeometry args={[0.96, 0.38, 0.02]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.7} />
        </mesh>
        {/* Horizontal Grille Slat Accents */}
        {[-0.08, 0, 0.08].map((gy, i) => (
          <mesh key={`grille-slat-${i}`} position={[0, 0.65 + gy, 0.825]}>
            <boxGeometry args={[0.9, 0.025, 0.01]} />
            <meshStandardMaterial color={TRUCK_ELECTRIC_CYAN} roughness={0.3} />
          </mesh>
        ))}

        {/* Tinted Front Windshield */}
        <mesh position={[0, 1.12, 0.68]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[1.12, 0.48, 0.02]} />
          <meshStandardMaterial color={GLASS_TINT} roughness={0.05} metalness={0.9} />
        </mesh>

        {/* Side Windows */}
        {[-0.605, 0.605].map((x, i) => (
          <mesh key={`cab-sw-${i}`} position={[x, 1.12, 0.25]}>
            <boxGeometry args={[0.01, 0.4, 0.58]} />
            <meshStandardMaterial color={GLASS_TINT} roughness={0.05} metalness={0.9} />
          </mesh>
        ))}

        {/* Dual LED Headlight Strips */}
        {[-0.44, 0.44].map((x, i) => (
          <group key={`cab-hl-${i}`} position={[x, 0.42, 0.88]}>
            <mesh>
              <boxGeometry args={[0.2, 0.1, 0.02]} />
              <meshStandardMaterial color="#FFFFFF" emissive={TRUCK_ELECTRIC_CYAN} emissiveIntensity={1.8} />
            </mesh>
            {/* Lower Fog Light */}
            <mesh position={[0, -0.09, 0]}>
              <boxGeometry args={[0.12, 0.04, 0.02]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#F8FAFC" emissiveIntensity={1.2} />
            </mesh>
          </group>
        ))}

        {/* Dual Rearview Mirrors */}
        {[-0.66, 0.66].map((x, i) => (
          <group key={`cab-mirror-${i}`} position={[x, 1.05, 0.62]}>
            <mesh castShadow>
              <boxGeometry args={[0.04, 0.22, 0.08]} />
              <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.5} />
            </mesh>
            <mesh position={[x > 0 ? -0.022 : 0.022, 0, -0.01]}>
              <boxGeometry args={[0.01, 0.18, 0.06]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 2. TRAILER CARGO UNIT ── */}
      <group position={[0, 0, -0.65]}>
        {/* Main Trailer Box (Polished Stylized Blue) */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.26, 1.48, 3.4]} />
          <meshStandardMaterial color={trailerColor} roughness={0.25} metalness={0.15} />
        </mesh>

        {/* Upper White Roof Fairing */}
        <mesh position={[0, 1.99, 0]} castShadow>
          <boxGeometry args={[1.24, 0.04, 3.38]} />
          <meshStandardMaterial color={TRUCK_TRAILER_WHITE} roughness={0.3} />
        </mesh>

        {/* Stylized Livery Side Stripe (Electric Blue) */}
        {[-0.635, 0.635].map((x, i) => (
          <group key={`livery-${i}`} position={[x, 1.2, 0]}>
            <mesh>
              <boxGeometry args={[0.01, 0.18, 2.8]} />
              <meshStandardMaterial color={TRUCK_ELECTRIC_CYAN} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[0.01, 0.06, 2.2]} />
              <meshStandardMaterial color={TRUCK_TRAILER_WHITE} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Lower Protective Navy Skirts / Underrun Protection */}
        {[-0.62, 0.62].map((x, i) => (
          <mesh key={`skirt-${i}`} position={[x, 0.42, 0.35]} castShadow>
            <boxGeometry args={[0.03, 0.24, 1.6]} />
            <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
          </mesh>
        ))}

        {/* Rear Container Doors */}
        <mesh position={[0, 1.25, -1.71]}>
          <boxGeometry args={[1.22, 1.42, 0.02]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
        </mesh>
        {/* Chrome Locking Rods */}
        {[-0.24, 0.24].map((x, i) => (
          <mesh key={`rod-${i}`} position={[x, 1.25, -1.73]}>
            <cylinderGeometry args={[0.015, 0.015, 1.25, 8]} />
            <meshStandardMaterial color={WHEEL_HUB_CHROME} metalness={0.9} roughness={0.15} />
          </mesh>
        ))}

        {/* Rear Bumper & LED Taillights */}
        <mesh position={[0, 0.36, -1.72]} castShadow>
          <boxGeometry args={[1.24, 0.16, 0.08]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
        </mesh>
        {[-0.44, -0.32, 0.32, 0.44].map((x, i) => (
          <mesh key={`tail-${i}`} position={[x, 0.36, -1.77]}>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>

      {/* ── 3. CHASSIS & DETAILS ── */}
      {/* Heavy Steel Chassis Spine */}
      <mesh position={[0, 0.32, 0.3]} castShadow>
        <boxGeometry args={[0.92, 0.14, 4.4]} />
        <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.8} metalness={0.7} />
      </mesh>
      {/* Cylindrical Aluminum Fuel Tanks */}
      {[-0.56, 0.56].map((x, i) => (
        <mesh key={`fuel-tank-${i}`} position={[x, 0.35, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.6, 12]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* ── 4. WHEELS (Firmly touching y = 0.0) ── */}
      {/* Axles: Front steer (1.85), Tractor drive (0.7, 0.1), Trailer tandem (-1.6, -2.15) */}
      {[1.85, 0.7, 0.1, -1.6, -2.15].flatMap((z, aIdx) =>
        [-0.68, 0.68].map((x, sIdx) => (
          <group key={`semi-whl-${aIdx}-${sIdx}`} position={[x, 0.28, z]}>
            {/* Rubber Tire: radius 0.28, centered at y = 0.28 -> bottom exactly touches y = 0.0 */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
              <meshStandardMaterial color={TIRE_RUBBER} roughness={0.92} />
            </mesh>
            {/* Inset Chrome Wheel Hub */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 0.19, 12]} />
              <meshStandardMaterial color={WHEEL_HUB_CHROME} metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Center Cap Nut */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.21, 8]} />
              <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.5} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

function StylizedMediumTruck({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = TRUCK_PRIMARY_BLUE,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  color?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* ── Cab (Tractor COE) ── */}
      <group position={[0, 0, 1.05]}>
        {/* Cab Lower Body */}
        <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.82, 0.9]} />
          <meshStandardMaterial color={color} roughness={0.22} metalness={0.18} />
        </mesh>
        {/* Aerodynamic Wind Deflector Roof Cap */}
        <mesh position={[0, 1.15, -0.05]} castShadow>
          <boxGeometry args={[1.06, 0.18, 0.8]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.4} />
        </mesh>
        {/* Front Navy Bumper */}
        <mesh position={[0, 0.38, 0.46]} castShadow>
          <boxGeometry args={[1.14, 0.24, 0.16]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
        </mesh>
        {/* Front Intake Grille */}
        <mesh position={[0, 0.58, 0.47]}>
          <boxGeometry args={[0.88, 0.28, 0.02]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.7} />
        </mesh>
        {/* Sloped Windshield */}
        <mesh position={[0, 0.88, 0.42]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[1.04, 0.42, 0.02]} />
          <meshStandardMaterial color={GLASS_TINT} roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Side Windows */}
        {[-0.555, 0.555].map((x, i) => (
          <mesh key={`m-sw-${i}`} position={[x, 0.88, 0]}>
            <boxGeometry args={[0.01, 0.36, 0.5]} />
            <meshStandardMaterial color={GLASS_TINT} roughness={0.05} metalness={0.9} />
          </mesh>
        ))}
        {/* LED Headlights */}
        {[-0.4, 0.4].map((x, i) => (
          <mesh key={`m-hl-${i}`} position={[x, 0.38, 0.55]}>
            <boxGeometry args={[0.18, 0.09, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" emissive={TRUCK_ELECTRIC_CYAN} emissiveIntensity={1.8} />
          </mesh>
        ))}
        {/* Side Mirrors */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={`m-mir-${i}`} position={[x, 0.82, 0.35]} castShadow>
            <boxGeometry args={[0.03, 0.18, 0.07]} />
            <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── Cargo Box ── */}
      <group position={[0, 0, -0.35]}>
        {/* Main Box */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.16, 1.26, 2.3]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} />
        </mesh>
        {/* White Roof Cap */}
        <mesh position={[0, 1.74, 0]} castShadow>
          <boxGeometry args={[1.14, 0.04, 2.28]} />
          <meshStandardMaterial color={TRUCK_TRAILER_WHITE} roughness={0.3} />
        </mesh>
        {/* Side Livery Stripe */}
        {[-0.585, 0.585].map((x, i) => (
          <mesh key={`m-strip-${i}`} position={[x, 1.08, 0]}>
            <boxGeometry args={[0.01, 0.14, 1.9]} />
            <meshStandardMaterial color={TRUCK_ELECTRIC_CYAN} roughness={0.2} />
          </mesh>
        ))}
        {/* Rear Shutter Door */}
        <mesh position={[0, 1.08, -1.16]}>
          <boxGeometry args={[1.12, 1.2, 0.02]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
        </mesh>
        {/* Rear Bumper & Taillights */}
        <mesh position={[0, 0.32, -1.16]} castShadow>
          <boxGeometry args={[1.14, 0.12, 0.06]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
        </mesh>
        {[-0.38, 0.38].map((x, i) => (
          <mesh key={`m-tail-${i}`} position={[x, 0.32, -1.2]}>
            <boxGeometry args={[0.1, 0.05, 0.02]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.4} />
          </mesh>
        ))}
      </group>

      {/* ── Steel Chassis ── */}
      <mesh position={[0, 0.28, 0.3]} castShadow>
        <boxGeometry args={[0.86, 0.12, 2.9]} />
        <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.8} />
      </mesh>

      {/* ── Wheels (Radius 0.25 centered at y = 0.25, touches y = 0.0) ── */}
      {[1.05, -0.85].flatMap((z, aIdx) =>
        [-0.62, 0.62].map((x, sIdx) => (
          <group key={`m-whl-${aIdx}-${sIdx}`} position={[x, 0.25, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.16, 16]} />
              <meshStandardMaterial color={TIRE_RUBBER} roughness={0.92} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.13, 0.13, 0.17, 12]} />
              <meshStandardMaterial color={WHEEL_HUB_CHROME} metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

function StylizedUrbanVan({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = TRUCK_PRIMARY_BLUE,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  color?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Lower Navy Cladding & Bumper */}
      <mesh position={[0, 0.32, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.24, 2.3]} />
        <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.6} />
      </mesh>

      {/* Main Van Cabin & Cargo Body */}
      <mesh position={[0, 0.72, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.88, 0.68, 1.85]} />
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.15} />
      </mesh>

      {/* Sloped Aerodynamic Front Nose */}
      <mesh position={[0, 0.54, 0.95]} rotation={[-0.26, 0, 0]} castShadow>
        <boxGeometry args={[0.86, 0.36, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.15} />
      </mesh>

      {/* Tinted Raked Windshield */}
      <mesh position={[0, 0.84, 0.78]} rotation={[-0.34, 0, 0]}>
        <boxGeometry args={[0.82, 0.38, 0.02]} />
        <meshStandardMaterial color={GLASS_TINT} roughness={0.05} metalness={0.9} />
      </mesh>

      {/* Driver/Passenger Side Windows */}
      {[-0.445, 0.445].map((x, i) => (
        <mesh key={`v-sw-${i}`} position={[x, 0.82, 0.45]}>
          <boxGeometry args={[0.01, 0.32, 0.44]} />
          <meshStandardMaterial color={GLASS_TINT} roughness={0.05} metalness={0.9} />
        </mesh>
      ))}

      {/* Front LED Headlights */}
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={`v-hl-${i}`} position={[x, 0.42, 1.2]}>
          <boxGeometry args={[0.14, 0.07, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" emissive={TRUCK_ELECTRIC_CYAN} emissiveIntensity={1.8} />
        </mesh>
      ))}

      {/* Side Mirrors */}
      {[-0.48, 0.48].map((x, i) => (
        <mesh key={`v-mir-${i}`} position={[x, 0.76, 0.72]} castShadow>
          <boxGeometry args={[0.03, 0.12, 0.05]} />
          <meshStandardMaterial color={TRUCK_DEEP_NAVY} roughness={0.5} />
        </mesh>
      ))}

      {/* Side Cyan Graphic Accent Strip */}
      {[-0.445, 0.445].map((x, i) => (
        <mesh key={`v-dec-${i}`} position={[x, 0.65, -0.2]}>
          <boxGeometry args={[0.01, 0.1, 1.3]} />
          <meshStandardMaterial color={TRUCK_ELECTRIC_CYAN} roughness={0.2} />
        </mesh>
      ))}

      {/* Rear Vertical Taillights */}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={`v-tail-${i}`} position={[x, 0.68, -1.04]}>
          <boxGeometry args={[0.04, 0.32, 0.02]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.5} />
        </mesh>
      ))}

      {/* ── 4 Wheels (Radius 0.20 centered at y = 0.20, touches y = 0.0) ── */}
      {[0.75, -0.65].flatMap((z, aIdx) =>
        [-0.47, 0.47].map((x, sIdx) => (
          <group key={`v-whl-${aIdx}-${sIdx}`} position={[x, 0.2, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.12, 14]} />
              <meshStandardMaterial color={TIRE_RUBBER} roughness={0.92} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.13, 10]} />
              <meshStandardMaterial color={WHEEL_HUB_CHROME} metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

/**
 * ───────────────────────────────────────────────────────────────────
 * MASTER MINIATURE LOGISTICS CAMPUS DIORAMA
 * ───────────────────────────────────────────────────────────────────
 */
export default function MiniatureLogisticsCampus({
  reducedMotion = false,
}: {
  reducedMotion?: boolean
}) {
  // Road Splines for moving traffic
  const highwaySpline = useMemo(() => {
    const pts = CAMPUS_ROAD_CIRCUIT.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    return new THREE.CatmullRomCurve3(pts, true)
  }, [])

  const vanSpline = useMemo(() => {
    const pts = INNER_VAN_CIRCUIT.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    return new THREE.CatmullRomCurve3(pts, true)
  }, [])

  // Traffic Motion Refs
  const movingSemiRef = useRef<THREE.Group>(null)
  const movingRigidRef = useRef<THREE.Group>(null)
  const movingVanRef = useRef<THREE.Group>(null)

  // Animated Conveyor Parcels Refs
  const bridgeParcelRef1 = useRef<THREE.Group>(null)
  const bridgeParcelRef2 = useRef<THREE.Group>(null)
  const sortingParcelRef1 = useRef<THREE.Group>(null)
  const sortingParcelRef2 = useRef<THREE.Group>(null)
  const sortingParcelRef3 = useRef<THREE.Group>(null)

  const semiProgress = useRef(0.08)
  const rigidProgress = useRef(0.58)
  const vanProgress = useRef(0.32)
  const bridgeParcelProgress = useRef(0.1)
  const sortingParcelProgress = useRef(0.2)

  useFrame((_, delta) => {
    if (reducedMotion) return

    // 1. Move Class 8 Semi along highway loop
    semiProgress.current = (semiProgress.current + delta * 0.022) % 1
    if (movingSemiRef.current) {
      const pos = highwaySpline.getPoint(semiProgress.current)
      const tan = highwaySpline.getTangent(semiProgress.current)
      movingSemiRef.current.position.set(pos.x, 0, pos.z)
      movingSemiRef.current.rotation.y = Math.atan2(tan.x, tan.z)
    }

    // 2. Move Medium Truck on opposite side of loop (offset by 0.5 to prevent bunching)
    rigidProgress.current = (rigidProgress.current + delta * 0.026) % 1
    if (movingRigidRef.current) {
      const pos = highwaySpline.getPoint(rigidProgress.current)
      const tan = highwaySpline.getTangent(rigidProgress.current)
      movingRigidRef.current.position.set(pos.x, 0, pos.z)
      movingRigidRef.current.rotation.y = Math.atan2(tan.x, tan.z)
    }

    // 3. Move Urban Van along inner delivery loop
    vanProgress.current = (vanProgress.current + delta * 0.034) % 1
    if (movingVanRef.current) {
      const pos = vanSpline.getPoint(vanProgress.current)
      const tan = vanSpline.getTangent(vanProgress.current)
      movingVanRef.current.position.set(pos.x, 0, pos.z)
      movingVanRef.current.rotation.y = Math.atan2(tan.x, tan.z)
    }

    // 4. Move Parcels along Cross-Dock loading conveyor bridge
    bridgeParcelProgress.current = (bridgeParcelProgress.current + delta * 0.32) % 1
    if (bridgeParcelRef1.current) {
      const p1 = bridgeParcelProgress.current
      bridgeParcelRef1.current.position.x = -0.7 + p1 * 1.5
    }
    if (bridgeParcelRef2.current) {
      const p2 = (bridgeParcelProgress.current + 0.5) % 1
      bridgeParcelRef2.current.position.x = -0.7 + p2 * 1.5
    }

    // 5. Move Parcels along Apron sorting conveyor line
    sortingParcelProgress.current = (sortingParcelProgress.current + delta * 0.28) % 1
    if (sortingParcelRef1.current) {
      const sp1 = sortingParcelProgress.current
      sortingParcelRef1.current.position.x = -1.6 + sp1 * 3.2
    }
    if (sortingParcelRef2.current) {
      const sp2 = (sortingParcelProgress.current + 0.33) % 1
      sortingParcelRef2.current.position.x = -1.6 + sp2 * 3.2
    }
    if (sortingParcelRef3.current) {
      const sp3 = (sortingParcelProgress.current + 0.66) % 1
      sortingParcelRef3.current.position.x = -1.6 + sp3 * 3.2
    }
  })

  return (
    <group position={[3.6, 0, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. COHESIVE ARCHITECTURAL DIORAMA PLINTH (No floating gaps!)
      ────────────────────────────────────────────────────────────── */}
      {/* Main Ground Slab (Pristine Light Clay, firmly anchored) */}
      <mesh position={[0.2, -0.18, -2.2]} receiveShadow>
        <boxGeometry args={[26.4, 0.36, 17.6]} />
        <meshStandardMaterial color={COLOR_CANVAS_BG} roughness={0.8} metalness={0.02} />
      </mesh>
      {/* Crisp White Architectural Plinth Bevel Edges */}
      <mesh position={[0.2, -0.38, -2.2]} receiveShadow>
        <boxGeometry args={[26.9, 0.06, 18.1]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. CONNECTED ROAD NETWORK (Directly touching Plinth y = 0.01)
      ────────────────────────────────────────────────────────────── */}
      {/* South Arterial Boulevard */}
      <mesh position={[0.2, 0.01, 4.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[23.2, 2.8]} />
        <meshStandardMaterial color={COLOR_ROAD_DARK} roughness={0.7} />
      </mesh>
      {/* Boulevard White Dashes */}
      {[-9, -6, -3, 0, 3, 6, 9].map((x) => (
        <mesh key={`dash-${x}`} position={[x, 0.015, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 0.1]} />
          <meshBasicMaterial color={COLOR_LINE_WHITE} />
        </mesh>
      ))}

      {/* East Highway Link */}
      <mesh position={[10.2, 0.01, -2.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 15.6]} />
        <meshStandardMaterial color={COLOR_ROAD_DARK} roughness={0.7} />
      </mesh>
      {/* East Dashed Centerline */}
      {[-8, -5, -2, 1, 3.5].map((z) => (
        <mesh key={`edash-${z}`} position={[10.2, 0.015, z]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[1.4, 0.1]} />
          <meshBasicMaterial color={COLOR_LINE_WHITE} />
        </mesh>
      ))}

      {/* North / Rear Bypass Road */}
      <mesh position={[0.2, 0.01, -8.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22.8, 2.6]} />
        <meshStandardMaterial color={COLOR_ROAD_DARK} roughness={0.7} />
      </mesh>
      {/* North Dashed Centerline */}
      {[-7, -4, -1, 2, 5, 8].map((x) => (
        <mesh key={`ndash-${x}`} position={[x, 0.015, -8.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 0.1]} />
          <meshBasicMaterial color={COLOR_LINE_WHITE} />
        </mesh>
      ))}

      {/* West Transit Link Road */}
      <mesh position={[-9.6, 0.01, -2.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 15.6]} />
        <meshStandardMaterial color={COLOR_ROAD_DARK} roughness={0.7} />
      </mesh>
      {/* West Dashed Centerline */}
      {[-8, -5, -2, 1, 3.5].map((z) => (
        <mesh key={`wdash-${z}`} position={[-9.6, 0.015, z]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[1.4, 0.1]} />
          <meshBasicMaterial color={COLOR_LINE_WHITE} />
        </mesh>
      ))}

      {/* Main Terminal Loading Apron (Concrete staging floor) */}
      <mesh position={[0.5, 0.008, -0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14.2, 6.2]} />
        <meshStandardMaterial color={COLOR_ROAD_APRON} roughness={0.75} />
      </mesh>

      {/* Raised Perimeter Curbs (Image 1 Style) */}
      <mesh position={[0, 0.06, 5.7]} castShadow receiveShadow>
        <boxGeometry args={[22.2, 0.12, 0.2]} />
        <meshStandardMaterial color={COLOR_CURB_WHITE} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.06, 2.7]} castShadow receiveShadow>
        <boxGeometry args={[7, 0.12, 0.25]} />
        <meshStandardMaterial color={COLOR_CURB_WHITE} roughness={0.4} />
      </mesh>

      {/* 4 Painted Loading Dock Guide Lanes (In front of Super-Hub bays) */}
      {[2.2, 3.8, 5.4, 7.0].map((x) => (
        <group key={`dock-lane-${x}`} position={[x, 0.015, -1.2]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.3, 2.8]} />
            <meshBasicMaterial color={COLOR_ACCENT_BLUE} transparent opacity={0.14} />
          </mesh>
          <mesh position={[-0.65, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 2.8]} />
            <meshBasicMaterial color={COLOR_ACCENT_BLUE} />
          </mesh>
          <mesh position={[0.65, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 2.8]} />
            <meshBasicMaterial color={COLOR_ACCENT_BLUE} />
          </mesh>
        </group>
      ))}

      {/* 3 Staged Diagonal Parking Slots on Apron */}
      {[-4.0, -2.4, -0.8].map((x, i) => (
        <group key={`park-slot-${i}`} position={[x, 0.015, -0.6]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.3, 3.4]} />
            <meshBasicMaterial color="#1E293B" transparent opacity={0.25} />
          </mesh>
          <mesh position={[-0.65, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 3.4]} />
            <meshBasicMaterial color={COLOR_LINE_WHITE} />
          </mesh>
          <mesh position={[0.65, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 3.4]} />
            <meshBasicMaterial color={COLOR_LINE_WHITE} />
          </mesh>
          <mesh position={[0, 0.04, -1.6]} castShadow>
            <boxGeometry args={[1.0, 0.08, 0.12]} />
            <meshStandardMaterial color={COLOR_LINE_YELLOW} />
          </mesh>
        </group>
      ))}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN FULFILLMENT SUPER-HUB (Center-Right, Image 2 Style)
      ────────────────────────────────────────────────────────────── */}
      <group position={[4.6, 0, -4.5]}>
        {/* Main Warehouse Hall */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.8, 4.4, 6.2]} />
          <meshStandardMaterial color={COLOR_BLDG_WHITE} roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Deep Navy Roof Parapet */}
        <mesh position={[0, 4.45, 0]} castShadow>
          <boxGeometry args={[7.9, 0.4, 6.3]} />
          <meshStandardMaterial color={COLOR_BLDG_NAVY} roughness={0.4} />
        </mesh>
        {/* Electric Cyan Accent Header Band */}
        <mesh position={[0, 4.22, 3.12]} castShadow>
          <boxGeometry args={[7.85, 0.22, 0.06]} />
          <meshStandardMaterial color={COLOR_BLDG_CYAN} roughness={0.2} />
        </mesh>

        {/* ── 4 Raised Loading Dock Bays with Corrugated Doors ── */}
        {[-2.4, -0.8, 0.8, 2.4].map((dx, i) => (
          <group key={`superdock-${i}`} position={[dx, 0, 3.11]}>
            {/* Shutter Recess */}
            <mesh position={[0, 1.35, 0]}>
              <boxGeometry args={[1.3, 2.2, 0.08]} />
              <meshStandardMaterial color="#0B132B" roughness={0.7} />
            </mesh>
            {/* Shutter Door Surface */}
            <mesh position={[0, 1.38, 0.02]}>
              <boxGeometry args={[1.18, 2.05, 0.03]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
            </mesh>
            {/* Shutter Horizontal Slats */}
            {[-0.7, -0.35, 0, 0.35, 0.7].map((sy) => (
              <mesh key={`slat-${sy}`} position={[0, 1.38 + sy, 0.04]}>
                <boxGeometry args={[1.16, 0.03, 0.015]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.5} />
              </mesh>
            ))}
            {/* Protective Dock Cushion Perimeter */}
            <mesh position={[0, 1.35, 0.06]} castShadow>
              <boxGeometry args={[1.42, 2.32, 0.08]} />
              <meshStandardMaterial color={COLOR_BLDG_CYAN} roughness={0.3} />
            </mesh>
            {/* Active Status LED */}
            <mesh position={[0.55, 2.6, 0.1]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial
                color={i === 1 ? '#EF4444' : '#16A34A'}
                emissive={i === 1 ? '#EF4444' : '#16A34A'}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        ))}

        {/* ── Rooftop Solar Panel Grid Array (Image 2 Signature) ── */}
        <mesh position={[0, 4.52, 0]} receiveShadow>
          <boxGeometry args={[7.6, 0.04, 6.0]} />
          <meshStandardMaterial color={COLOR_ROOF_SLATE} roughness={0.8} />
        </mesh>
        {[-2.2, -0.7, 0.8, 2.2].flatMap((sx, cIdx) =>
          [-1.8, -0.5, 0.8, 2.0].map((sz, rIdx) => (
            <mesh
              key={`sp-${cIdx}-${rIdx}`}
              position={[sx, 4.62, sz]}
              rotation={[-0.08, 0, 0]}
              castShadow
            >
              <boxGeometry args={[1.15, 0.03, 0.9]} />
              <meshStandardMaterial color={COLOR_SOLAR_BLUE} metalness={0.7} roughness={0.15} />
            </mesh>
          ))
        )}

        {/* Rooftop HVAC Ventilation Units */}
        {[-2.4, 2.4].map((vx, i) => (
          <mesh key={`hvac-${i}`} position={[vx, 4.75, -2.2]} castShadow>
            <boxGeometry args={[1.2, 0.35, 0.8]} />
            <meshStandardMaterial color={COLOR_BLDG_WHITE} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. INBOUND CROSS-DOCK TERMINAL (Center-Left, Image 1 Style)
      ────────────────────────────────────────────────────────────── */}
      <group position={[-5.8, 0, -1.0]}>
        {/* Blue Cube Warehouse */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 3.6, 4.4]} />
          <meshStandardMaterial color={COLOR_BLDG_BLUE} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Quad-Panel White Roof Cap (Image 1 Style) */}
        <group position={[0, 3.62, 0]}>
          {[-1.05, 1.05].flatMap((qx, xi) =>
            [-1.05, 1.05].map((qz, zi) => (
              <mesh key={`quad-${xi}-${zi}`} position={[qx, 0.04, qz]} castShadow>
                <boxGeometry args={[1.9, 0.08, 1.9]} />
                <meshStandardMaterial color={COLOR_BLDG_WHITE} roughness={0.3} />
              </mesh>
            ))
          )}
        </group>
        {/* Loading Shutter Door */}
        <mesh position={[2.21, 1.2, 0]}>
          <boxGeometry args={[0.04, 1.9, 1.8]} />
          <meshStandardMaterial color={COLOR_BLDG_WHITE} roughness={0.5} />
        </mesh>
        <mesh position={[2.22, 1.2, 0]}>
          <boxGeometry args={[0.02, 1.7, 1.6]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>

        {/* Overhead Conveyor Bridge Loading into Waiting Truck */}
        <group position={[3.0, 0, 0]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[1.8, 0.14, 0.7]} />
            <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0.6, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.5, 10]} />
            <meshStandardMaterial color="#1E3A5F" />
          </mesh>
          {/* Cardboard Boxes gliding smoothly along bridge */}
          <group ref={bridgeParcelRef1} position={[-0.4, 1.68, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.26, 0.3]} />
              <meshStandardMaterial color="#D4A574" roughness={0.8} />
            </mesh>
          </group>
          <group ref={bridgeParcelRef2} position={[0.3, 1.68, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.36, 0.28, 0.32]} />
              <meshStandardMaterial color="#C8956A" roughness={0.8} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4b. ACTIVE PARCEL SORTING CONVEYOR LINE (Apron Staging Area)
      ────────────────────────────────────────────────────────────── */}
      <group position={[0.2, 0, -1.8]}>
        {/* Conveyor Bed */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.12, 0.76]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        {/* Conveyor Rubber Slat Belt */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[3.72, 0.04, 0.66]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Support Legs */}
        {[-1.6, 0, 1.6].map((lx, li) => (
          <mesh key={`conv-leg-${li}`} position={[lx, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.3, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} />
          </mesh>
        ))}
        {/* Optical Barcode Scanner Tunnel with Cyan Sensor Window */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[0, 0.36, 0]} castShadow>
            <boxGeometry args={[0.54, 0.72, 0.82]} />
            <meshStandardMaterial color="#0284C7" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[0.44, 0.6, 0.74]} />
            <meshStandardMaterial color="#0B132B" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.03, 0.46, 0.65]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
          </mesh>
        </group>
        {/* Active Moving Parcels on Conveyor */}
        <group ref={sortingParcelRef1} position={[-1.2, 0.52, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.26, 0.3]} />
            <meshStandardMaterial color="#D4A574" roughness={0.8} />
          </mesh>
        </group>
        <group ref={sortingParcelRef2} position={[0.2, 0.52, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.28, 0.32]} />
            <meshStandardMaterial color="#C8956A" roughness={0.8} />
          </mesh>
        </group>
        <group ref={sortingParcelRef3} position={[1.2, 0.52, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.24, 0.28]} />
            <meshStandardMaterial color="#D4A574" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. SECURITY GATEHOUSE & PERIMETER CHECKPOINT (Southwest)
      ────────────────────────────────────────────────────────────── */}
      <group position={[-8.5, 0, 2.6]}>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.5, 1.2]} />
          <meshStandardMaterial color={COLOR_BLDG_WHITE} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.55, 0]} castShadow>
          <boxGeometry args={[1.4, 0.08, 1.4]} />
          <meshStandardMaterial color={COLOR_BLDG_NAVY} roughness={0.4} />
        </mesh>
        {/* Guard Observation Window */}
        <mesh position={[0, 0.9, 0.61]}>
          <boxGeometry args={[0.95, 0.55, 0.02]} />
          <meshStandardMaterial color="#0B132B" roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Automated Barrier Gate Arm */}
        <group position={[0.75, 0.45, 0]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 10]} />
            <meshStandardMaterial color="#EA580C" />
          </mesh>
          <mesh position={[0.9, 0.35, 0]} rotation={[0, 0, 0.08]} castShadow>
            <boxGeometry args={[1.8, 0.05, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. DOCKED TRUCKS & STAGED FLEET (Image 1 & 2 Style)
      ────────────────────────────────────────────────────────────── */}
      {/* Semi-Trailer 1 backed firmly into Super-Hub Bay 01 */}
      <SemiTrailerTruck position={[2.2, 0, -1.2]} rotation={[0, 0, 0]} cabColor={TRUCK_PRIMARY_BLUE} trailerColor={TRUCK_TRAILER_BODY} />
      {/* Semi-Trailer 2 backed firmly into Super-Hub Bay 03 */}
      <SemiTrailerTruck position={[5.4, 0, -1.2]} rotation={[0, 0, 0]} cabColor={TRUCK_PRIMARY_BLUE} trailerColor={TRUCK_TRAILER_BODY} />

      {/* Truck receiving conveyor parcels at Cross-Dock */}
      <StylizedMediumTruck position={[-3.6, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color={TRUCK_PRIMARY_BLUE} />

      {/* Staged Trucks in Diagonal Apron Parking Slots */}
      <StylizedMediumTruck position={[-4.0, 0, -0.6]} rotation={[0, 0, 0]} color={TRUCK_PRIMARY_BLUE} />
      <StylizedUrbanVan position={[-2.4, 0, -0.6]} rotation={[0, 0, 0]} color={TRUCK_PRIMARY_BLUE} />
      <StylizedMediumTruck position={[-0.8, 0, -0.6]} rotation={[0, 0, 0]} color={TRUCK_PRIMARY_BLUE} />

      {/* ─────────────────────────────────────────────────────────────
          7. MOVING TRAFFIC ALONG ROAD CIRCUIT (Smooth useFrame loops)
      ────────────────────────────────────────────────────────────── */}
      {/* Class 8 Semi-Trailer Truck moving on Highway */}
      <group ref={movingSemiRef}>
        <SemiTrailerTruck cabColor={TRUCK_PRIMARY_BLUE} trailerColor={TRUCK_TRAILER_BODY} />
      </group>

      {/* Medium Delivery Truck navigating road junction */}
      <group ref={movingRigidRef}>
        <StylizedMediumTruck color={TRUCK_PRIMARY_BLUE} />
      </group>

      {/* Urban Parcel Delivery Van on boulevard */}
      <group ref={movingVanRef}>
        <StylizedUrbanVan color={TRUCK_PRIMARY_BLUE} />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          8. RESTRAINED ENVIRONMENTAL PROPS & LANDSCAPING (No floating!)
      ────────────────────────────────────────────────────────────── */}
      {/* Low-Poly Green Perimeter Hedges along South Boulevard */}
      {[-8, -4, 0, 4, 8].map((hx) => (
        <mesh key={`hedge-${hx}`} position={[hx, 0.25, 5.5]} castShadow>
          <boxGeometry args={[3.2, 0.5, 0.35]} />
          <meshStandardMaterial color="#166534" roughness={0.7} />
        </mesh>
      ))}

      {/* Stylized Minimalist Cone Trees (Reference Image 1 Scandinavian Aesthetic) */}
      {[
        [-10, 0, 5.5],
        [10, 0, 5.5],
        [10, 0, -6.5],
        [-10, 0, -6.5],
        [-10, 0, 0],
        [10, 0, 0],
      ].map(([tx, ty, tz], i) => (
        <group key={`tree-${i}`} position={[tx, ty, tz]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <coneGeometry args={[0.5, 1.4, 16]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#E2E8F0' : '#BAE6FD'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 8]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Organized Pallet Stacks against Warehouse wall */}
      {[
        [0.8, 0, -4.5],
        [-0.4, 0, -4.5],
        [-1.6, 0, -4.5],
      ].map(([px, py, pz], i) => (
        <group key={`pallet-${i}`} position={[px, py, pz]}>
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color="#8B6914" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.75, 0.5, 0.75]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#D4A574' : '#C8956A'} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

