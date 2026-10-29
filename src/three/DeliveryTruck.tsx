'use client'

// Delivery truck — procedural, blue, matching reference image style

interface DeliveryTruckProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export default function DeliveryTruck({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: DeliveryTruckProps) {
  const BODY_COLOR = '#142238'
  const CABIN_COLOR = '#0D1B30'
  const WHEEL_COLOR = '#1a1a2e'
  const WINDSHIELD_COLOR = '#38BDF8'
  const CARGO_COLOR = '#D4A574'

  return (
    <group position={position} rotation={rotation}>
      {/* Cargo bed */}
      <mesh position={[0, 0.8, -0.6]} castShadow>
        <boxGeometry args={[1.6, 1.2, 3.0]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Cargo door */}
      <mesh position={[0, 0.8, 0.91]}>
        <boxGeometry args={[1.55, 1.15, 0.04]} />
        <meshStandardMaterial color="#1E3A5F" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.75, 1.65]} castShadow>
        <boxGeometry args={[1.5, 1.1, 1.1]} />
        <meshStandardMaterial color={CABIN_COLOR} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.9, 2.21]}>
        <boxGeometry args={[1.2, 0.65, 0.04]} />
        <meshStandardMaterial
          color={WINDSHIELD_COLOR}
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Headlights */}
      {[-0.55, 0.55].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.6, 2.22]}>
            <boxGeometry args={[0.25, 0.16, 0.03]} />
            <meshStandardMaterial color="#E0E0E0" emissive="#FFFDE7" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Wheels — 3 axles */}
      {[-1.2, 0, 1.2].map((z, axle) =>
        [-0.88, 0.88].map((x, side) => (
          <mesh
            key={`${axle}-${side}`}
            position={[x, 0.28, z]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
            <meshStandardMaterial color={WHEEL_COLOR} roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Wheel hubs */}
      {[-1.2, 0, 1.2].map((z, axle) =>
        [-0.88, 0.88].map((x, side) => (
          <mesh key={`hub-${axle}-${side}`} position={[x, 0.28, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.24, 8]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.4} metalness={0.6} />
          </mesh>
        ))
      )}

      {/* Chassis */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[1.3, 0.14, 4.0]} />
        <meshStandardMaterial color="#0C1A2E" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Cargo boxes on top (stacked) */}
      {[[-0.4, 1.55, -0.8], [0.3, 1.55, -0.5], [-0.2, 1.55, -0.2]].map(([bx, by, bz], i) => (
        <mesh key={i} position={[bx, by, bz]} castShadow>
          <boxGeometry args={[0.55, 0.42, 0.48]} />
          <meshStandardMaterial color={CARGO_COLOR} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

