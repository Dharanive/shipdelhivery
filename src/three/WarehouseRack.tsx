'use client'

// Warehouse rack with stacked pallets — matching reference image style

interface WarehouseRackProps {
  position?: [number, number, number]
}

export default function WarehouseRack({ position = [0, 0, 0] }: WarehouseRackProps) {
  const RACK_COLOR = '#8B9EB7'
  const PALLET_COLOR = '#C49A6C'
  const WOOD_COLOR = '#8B6914'

  return (
    <group position={position}>
      {/* Vertical uprights */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0]} castShadow>
          <boxGeometry args={[0.06, 2.4, 0.06]} />
          <meshStandardMaterial color={RACK_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Horizontal beams at 3 levels */}
      {[0.4, 1.1, 1.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[1.7, 0.05, 0.06]} />
          <meshStandardMaterial color={RACK_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Back uprights */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.2, -0.7]} castShadow>
          <boxGeometry args={[0.06, 2.4, 0.06]} />
          <meshStandardMaterial color={RACK_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Depth beams */}
      {[-0.8, 0.8].map((x, i) =>
        [0.4, 1.1, 1.8].map((y, j) => (
          <mesh key={`${i}-${j}`} position={[x, y, -0.35]} castShadow>
            <boxGeometry args={[0.06, 0.05, 0.7]} />
            <meshStandardMaterial color={RACK_COLOR} roughness={0.4} metalness={0.7} />
          </mesh>
        ))
      )}

      {/* Pallets and boxes on each shelf level */}
      {[0.5, 1.2].map((y, level) => (
        <group key={level} position={[0, y, -0.2]}>
          {/* Pallet base */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.1, 0.55]} />
            <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} />
          </mesh>
          {/* Stacked boxes (2×2 arrangement) */}
          {[[-0.35, 0.22, 0], [0.35, 0.22, 0], [-0.35, 0.55, 0], [0.35, 0.55, 0]].map(
            ([bx, by, bz], bi) => (
              <mesh key={bi} position={[bx, by, bz]} castShadow receiveShadow>
                <boxGeometry args={[0.55, 0.38, 0.45]} />
                <meshStandardMaterial
                  color={bi % 2 === 0 ? PALLET_COLOR : '#C8956A'}
                  roughness={0.85}
                />
              </mesh>
            )
          )}
        </group>
      ))}
    </group>
  )
}

