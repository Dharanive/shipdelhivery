'use client'

// Main Campus Transit Loop Spline Points (for Class 8 Semi-Trucks)
export const MAIN_ROAD_LOOP: [number, number, number][] = [
  [-11, 0, 5.5],    // Highway South Approach
  [-6, 0, 5.5],     // Loading Apron Turn
  [0, 0, 5.2],      // Front Boulevard
  [6, 0, 4.8],      // East Hub Turn
  [10.5, 0, 2.5],   // East Perimeter Highway
  [10.5, 0, -4.5],  // Northeast Corner
  [6, 0, -8.5],     // Rear Corridor
  [-1, 0, -8.5],    // Rear Storage Pass
  [-7, 0, -8.0],    // Northwest Turn
  [-11, 0, -4.5],   // West Transit Corridor
  [-11, 0, 1.5],    // Inbound Gate Checkpoint
]

// Secondary Urban Parcel Loop (for Medium Trucks & Vans)
export const INNER_DELIVERY_LOOP: [number, number, number][] = [
  [-5, 0, 2.2],     // Cross-Dock Bay
  [-1, 0, 2.2],     // Sorting Annex Approach
  [4, 0, 1.8],      // Main Hub Apron
  [4, 0, -3.2],     // Hub Yard Turn
  [-1, 0, -3.2],    // Internal Link Road
  [-5, 0, -1.5],    // Cross-Dock Staging
]

/**
 * Connected Architectural Road Network & Loading Apron
 * Features raised curbs, asphalt lanes, white dashed markings,
 * and electric blue guidance paths (Image 1 & 2 style).
 */
export default function RoadNetwork() {
  const ASPHALT_COLOR = '#1E293B'
  const CURB_COLOR = '#E2E8F0'
  const LINE_WHITE = '#FFFFFF'
  const GUIDANCE_BLUE = '#38BDF8'

  return (
    <group position={[0, 0, 0]}>
      {/* ── Main Roadways ── */}
      {/* 1. Arterial South-Front Boulevard */}
      <mesh position={[0, 0.01, 5.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 3.4]} />
        <meshStandardMaterial color={ASPHALT_COLOR} roughness={0.7} />
      </mesh>
      {/* Boulevard White Dashed Center Line */}
      {[-10, -7, -4, -1, 2, 5, 8, 11].map((x) => (
        <mesh key={`dash-s-${x}`} position={[x, 0.015, 5.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.12]} />
          <meshBasicMaterial color={LINE_WHITE} />
        </mesh>
      ))}

      {/* 2. East Highway Arterial */}
      <mesh position={[10.5, 0.01, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 15]} />
        <meshStandardMaterial color={ASPHALT_COLOR} roughness={0.7} />
      </mesh>
      {/* East Highway Dashed Line */}
      {[-6, -3, 0, 3, 6].map((z) => (
        <mesh key={`dash-e-${z}`} position={[10.5, 0.015, z]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[1.5, 0.12]} />
          <meshBasicMaterial color={LINE_WHITE} />
        </mesh>
      ))}

      {/* 3. North/Rear Corridor Road */}
      <mesh position={[0, 0.01, -8.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 3.2]} />
        <meshStandardMaterial color={ASPHALT_COLOR} roughness={0.7} />
      </mesh>

      {/* 4. West Corridor Road */}
      <mesh position={[-11, 0.01, -1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 14]} />
        <meshStandardMaterial color={ASPHALT_COLOR} roughness={0.7} />
      </mesh>

      {/* 5. Central Hub Apron & Intersections */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#243348" roughness={0.75} />
      </mesh>

      {/* ── Raised Curbs & Traffic Islands (Image 1 Style) ── */}
      {/* South boulevard curb rail */}
      <mesh position={[0, 0.07, 7.0]} castShadow receiveShadow>
        <boxGeometry args={[26, 0.14, 0.22]} />
        <meshStandardMaterial color={CURB_COLOR} roughness={0.4} />
      </mesh>
      {/* Center traffic median island */}
      <mesh position={[0, 0.06, 3.4]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.12, 0.35]} />
        <meshStandardMaterial color={CURB_COLOR} roughness={0.4} />
      </mesh>

      {/* ── Staged Parking Stalls & Painted Bay Lines (Image 2 Style) ── */}
      {/* Diagonal Truck Staging Slots on Apron */}
      {[-4.5, -2.5, -0.5, 1.5, 3.5].map((x, i) => (
        <group key={`stall-${i}`} position={[x, 0.016, 0]}>
          {/* Painted White Boundary Box */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.6, 3.8]} />
            <meshBasicMaterial color="#1E293B" transparent opacity={0.3} />
          </mesh>
          {/* Left/Right White Stall Stripe */}
          <mesh position={[-0.8, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 3.8]} />
            <meshBasicMaterial color={LINE_WHITE} />
          </mesh>
          <mesh position={[0.8, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 3.8]} />
            <meshBasicMaterial color={LINE_WHITE} />
          </mesh>
          {/* Front Yellow Wheel Stop Block */}
          <mesh position={[0, 0.04, -1.8]} castShadow>
            <boxGeometry args={[1.2, 0.08, 0.14]} />
            <meshStandardMaterial color="#EAB308" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ── Electric Blue Operational Guidance Line (Image 2 Accent) ── */}
      <mesh position={[0, 0.016, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.2, 5.3, 48]} />
        <meshBasicMaterial color={GUIDANCE_BLUE} transparent opacity={0.8} />
      </mesh>

      {/* ── Loading Bay Apron Markings (Directly In Front of Super-Hub Docks) ── */}
      {[2.5, 4.5, 6.5, 8.5].map((x, i) => (
        <group key={`dock-lane-${i}`} position={[x, 0.016, -1.2]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 3.2]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.12} />
          </mesh>
          {/* Dock guide line */}
          <mesh position={[-0.75, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 3.2]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          <mesh position={[0.75, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 3.2]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

