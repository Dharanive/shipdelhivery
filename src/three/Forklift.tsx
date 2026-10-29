'use client'

interface ForkliftProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export default function Forklift({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ForkliftProps) {
  const BODY_ORANGE = '#EA580C'
  const MAST_STEEL = '#1E293B'
  const TIRE_BLACK = '#0F172A'

  return (
    <group position={position} rotation={rotation}>
      {/* Chassis Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.9, 0.5, 1.4]} />
        <meshStandardMaterial color={BODY_ORANGE} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Counterweight rear */}
      <mesh position={[0, 0.45, -0.65]} castShadow>
        <boxGeometry args={[0.88, 0.55, 0.35]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Overhead Protective Cage */}
      <group position={[0, 0.95, -0.1]}>
        {/* 4 Pillars */}
        {[-0.38, 0.38].map((x, xi) =>
          [-0.38, 0.38].map((z, zi) => (
            <mesh key={`post-${xi}-${zi}`} position={[x, 0.3, z]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
              <meshStandardMaterial color={MAST_STEEL} roughness={0.5} metalness={0.7} />
            </mesh>
          ))
        )}
        {/* Roof grid */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.82, 0.04, 0.82]} />
          <meshStandardMaterial color={MAST_STEEL} roughness={0.5} metalness={0.7} />
        </mesh>
      </group>

      {/* Front Lifting Mast */}
      <group position={[0, 0.85, 0.8]}>
        {/* Dual upright vertical channels */}
        {[-0.25, 0.25].map((x, i) => (
          <mesh key={`mast-${i}`} position={[x, 0.25, 0]} castShadow>
            <boxGeometry args={[0.06, 1.7, 0.08]} />
            <meshStandardMaterial color={MAST_STEEL} roughness={0.4} metalness={0.8} />
          </mesh>
        ))}
        {/* Carriage crossbar */}
        <mesh position={[0, 0.1, 0.05]} castShadow>
          <boxGeometry args={[0.65, 0.12, 0.04]} />
          <meshStandardMaterial color={MAST_STEEL} roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Dual Lifting Forks */}
        {[-0.18, 0.18].map((x, i) => (
          <group key={`fork-${i}`} position={[x, -0.2, 0.08]}>
            <mesh position={[0, 0.16, 0]} castShadow>
              <boxGeometry args={[0.06, 0.45, 0.03]} />
              <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.05, 0.38]} castShadow>
              <boxGeometry args={[0.06, 0.03, 0.8]} />
              <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Wheels */}
      {[-0.48, 0.48].map((x, xi) =>
        [-0.45, 0.45].map((z, zi) => (
          <mesh
            key={`wheel-${xi}-${zi}`}
            position={[x, 0.22, z]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.22, 0.22, 0.14, 16]} />
            <meshStandardMaterial color={TIRE_BLACK} roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  )
}

