'use client'

/**
 * Architectural Warehouse Campus Complex
 * Inspired directly by Reference Image 1 & 2:
 * 1. Main Super-Hub (Navy/Cyan facade, solar panel arrays, 4 loading dock bays)
 * 2. Inbound Cross-Dock Terminal (Quad roof, external conveyor bridge)
 * 3. Security Gatehouse & Checkpoint
 * 4. Staged Pallet Racks & Industrial Landscaping
 */
export default function WarehouseComplex() {
  const HUB_NAVY = '#0F172A'
  const HUB_CYAN = '#0284C7'
  const HUB_WHITE = '#FFFFFF'
  const ROOF_SLATE = '#1E293B'
  const SOLAR_PANEL_BLUE = '#1E3A8A'
  const FRAME_CHROME = '#E2E8F0'

  return (
    <group position={[0, 0, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN FULFILLMENT SUPER-HUB (Right-Center, Image 2 style)
      ────────────────────────────────────────────────────────────── */}
      <group position={[5.5, 0, -4.5]}>
        {/* Main Building Body */}
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[9.5, 4.8, 7.8]} />
          <meshStandardMaterial color={HUB_WHITE} roughness={0.3} metalness={0.05} />
        </mesh>

        {/* Upper Parapet & Accent Facade (Deep Navy with Cyan Header) */}
        <mesh position={[0, 4.75, 0]} castShadow>
          <boxGeometry args={[9.6, 0.45, 7.9]} />
          <meshStandardMaterial color={HUB_NAVY} roughness={0.4} />
        </mesh>
        <mesh position={[0, 4.5, 3.92]} castShadow>
          <boxGeometry args={[9.55, 0.25, 0.08]} />
          <meshStandardMaterial color={HUB_CYAN} roughness={0.2} />
        </mesh>

        {/* Electric Cyan Main Entrance Portal (Left corner of building, Image 2) */}
        <group position={[-3.6, 0, 3.95]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[1.6, 3.6, 0.3]} />
            <meshStandardMaterial color={HUB_CYAN} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.4, 0.05]}>
            <boxGeometry args={[1.0, 2.6, 0.25]} />
            <meshStandardMaterial color="#0B132B" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

        {/* ── 4 Raised Loading Dock Bays ── */}
        {[
          { x: -1.8, bay: '01' },
          { x: 0.2, bay: '02' },
          { x: 2.2, bay: '03' },
          { x: 4.0, bay: '04' },
        ].map(({ x, bay }, i) => (
          <group key={`hub-dock-${bay}`} position={[x, 0, 3.92]}>
            {/* Dock Shutter Opening Frame */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[1.5, 2.4, 0.12]} />
              <meshStandardMaterial color={HUB_NAVY} roughness={0.6} />
            </mesh>
            {/* Corrugated Shutter Door */}
            <mesh position={[0, 1.55, 0.02]}>
              <boxGeometry args={[1.36, 2.2, 0.04]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
            </mesh>
            {/* Shutter Horizontal Creases */}
            {[-0.8, -0.4, 0, 0.4, 0.8].map((sy) => (
              <mesh key={`crease-${sy}`} position={[0, 1.55 + sy, 0.045]}>
                <boxGeometry args={[1.34, 0.04, 0.02]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.5} />
              </mesh>
            ))}
            {/* Raised Dock Weather Cushion Perimeter */}
            <mesh position={[0, 1.5, 0.08]} castShadow>
              <boxGeometry args={[1.62, 2.52, 0.1]} />
              <meshStandardMaterial color={HUB_CYAN} roughness={0.3} />
            </mesh>
            {/* Dock Status LED (Green/Red) */}
            <mesh position={[0.65, 2.8, 0.12]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial
                color={i === 1 ? '#EF4444' : '#16A34A'}
                emissive={i === 1 ? '#EF4444' : '#16A34A'}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        ))}

        {/* ── Roof Solar Panel Grid Array (Image 2 Signature Detail) ── */}
        <mesh position={[0, 4.85, 0]} receiveShadow>
          <boxGeometry args={[9.3, 0.05, 7.5]} />
          <meshStandardMaterial color={ROOF_SLATE} roughness={0.8} />
        </mesh>
        {/* 3x3 Solar Array Grid */}
        {[-2.8, -0.9, 1.0, 2.9].flatMap((sx, col) =>
          [-2.2, -0.7, 0.8, 2.3].map((sz, row) => (
            <mesh
              key={`solar-${col}-${row}`}
              position={[sx, 4.95, sz]}
              rotation={[-0.1, 0, 0]}
              castShadow
            >
              <boxGeometry args={[1.4, 0.04, 1.1]} />
              <meshStandardMaterial
                color={SOLAR_PANEL_BLUE}
                metalness={0.7}
                roughness={0.15}
              />
            </mesh>
          ))
        )}

        {/* Rooftop Ventilation Skylights */}
        {[-3.2, 0, 3.2].map((kx, i) => (
          <mesh key={`skylight-${i}`} position={[kx, 5.05, -2.6]} castShadow>
            <boxGeometry args={[1.6, 0.35, 0.8]} />
            <meshStandardMaterial color={HUB_WHITE} roughness={0.4} />
          </mesh>
        ))}

        {/* Hub Side Windows Architectural Band */}
        {[-2.0, -0.5, 1.0, 2.5].map((wz, wi) => (
          <mesh key={`win-side-${wi}`} position={[4.76, 2.4, wz]}>
            <boxGeometry args={[0.04, 1.2, 1.0]} />
            <meshStandardMaterial color="#0B132B" roughness={0.1} metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. INBOUND CROSS-DOCK TERMINAL (Left, Image 1 style)
      ────────────────────────────────────────────────────────────── */}
      <group position={[-7.5, 0, 0]}>
        {/* Main Blue Cube Warehouse */}
        <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 4.0, 5.2]} />
          <meshStandardMaterial color={HUB_CYAN} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Quad-Panel White Roof Cap (Image 1 Signature Detail) */}
        <group position={[0, 4.02, 0]}>
          <mesh position={[-1.25, 0.05, -1.25]} castShadow>
            <boxGeometry args={[2.3, 0.1, 2.3]} />
            <meshStandardMaterial color={HUB_WHITE} roughness={0.3} />
          </mesh>
          <mesh position={[1.25, 0.05, -1.25]} castShadow>
            <boxGeometry args={[2.3, 0.1, 2.3]} />
            <meshStandardMaterial color={HUB_WHITE} roughness={0.3} />
          </mesh>
          <mesh position={[-1.25, 0.05, 1.25]} castShadow>
            <boxGeometry args={[2.3, 0.1, 2.3]} />
            <meshStandardMaterial color={HUB_WHITE} roughness={0.3} />
          </mesh>
          <mesh position={[1.25, 0.05, 1.25]} castShadow>
            <boxGeometry args={[2.3, 0.1, 2.3]} />
            <meshStandardMaterial color={HUB_WHITE} roughness={0.3} />
          </mesh>
        </group>

        {/* Loading Shutter Portal Facing Roadway */}
        <mesh position={[2.61, 1.3, 0]}>
          <boxGeometry args={[0.04, 2.2, 2.4]} />
          <meshStandardMaterial color={HUB_WHITE} roughness={0.5} />
        </mesh>
        <mesh position={[2.62, 1.3, 0]}>
          <boxGeometry args={[0.02, 2.0, 2.2]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>

        {/* External Overhead Conveyor Bridge Loading directly into Truck */}
        <group position={[3.6, 0, 0]}>
          {/* Conveyor Beam */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[2.0, 0.16, 0.8]} />
            <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Support Legs */}
          <mesh position={[0.7, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 12]} />
            <meshStandardMaterial color="#1E3A5F" roughness={0.4} />
          </mesh>
          {/* Parcels on bridge */}
          {[-0.6, 0.2].map((bx, bi) => (
            <mesh key={`ext-box-${bi}`} position={[bx, 1.98, 0]} castShadow>
              <boxGeometry args={[0.42, 0.32, 0.36]} />
              <meshStandardMaterial color={bi === 0 ? '#D4A574' : '#C8956A'} roughness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. SECURITY GATEHOUSE & PERIMETER CHECKPOINT (Foreground Left)
      ────────────────────────────────────────────────────────────── */}
      <group position={[-7.5, 0, 4.2]}>
        {/* Gatehouse Booth */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.8, 1.5]} />
          <meshStandardMaterial color={HUB_WHITE} roughness={0.3} />
        </mesh>
        {/* Overhanging Roof */}
        <mesh position={[0, 1.85, 0]} castShadow>
          <boxGeometry args={[1.8, 0.1, 1.8]} />
          <meshStandardMaterial color={HUB_NAVY} roughness={0.4} />
        </mesh>
        {/* Guard Observation Windows */}
        <mesh position={[0, 1.1, 0.76]}>
          <boxGeometry args={[1.2, 0.65, 0.02]} />
          <meshStandardMaterial color="#0B132B" roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Automated Gate Boom Barrier (Red/White stripes) */}
        <group position={[0.9, 0.5, 0]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 12]} />
            <meshStandardMaterial color="#EA580C" roughness={0.4} />
          </mesh>
          {/* Horizontal Barrier Arm */}
          <mesh position={[1.2, 0.4, 0]} rotation={[0, 0, 0.08]} castShadow>
            <boxGeometry args={[2.2, 0.06, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. PERIMETER SECURITY FENCES & MINIMALIST LANDSCAPING (Image 2)
      ────────────────────────────────────────────────────────────── */}
      {/* South Perimeter Fence with Security Hedges */}
      {[-9, -5, -1, 3, 7, 10].map((hx) => (
        <group key={`hedge-s-${hx}`} position={[hx, 0, 6.8]}>
          {/* Low-poly manicured green hedge */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[3.6, 0.7, 0.45]} />
            <meshStandardMaterial color="#15803D" roughness={0.7} />
          </mesh>
          {/* White security boundary posts */}
          <mesh position={[-1.7, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
            <meshStandardMaterial color={FRAME_CHROME} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Round architectural trees along perimeter */}
      {[
        [-11.5, 0, 6.8],
        [-11.5, 0, 4.0],
        [11.5, 0, 6.8],
        [11.5, 0, 3.5],
        [11.5, 0, -6.5],
        [-11.5, 0, -6.5],
      ].map(([tx, ty, tz], i) => (
        <group key={`tree-${i}`} position={[tx, ty, tz]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <sphereGeometry args={[0.65, 14, 14]} />
            <meshStandardMaterial color="#16A34A" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

