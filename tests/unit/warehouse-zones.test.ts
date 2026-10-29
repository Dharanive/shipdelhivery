import { describe, it, expect } from 'vitest'
import { ZONES } from '@/three/WarehouseFloor'
import { PATH_POINTS } from '@/three/Parcel'
import type { WarehouseZoneId } from '@/three/WarehouseCamera'

describe('3D Warehouse Zones and Layout', () => {
  const expectedZones: WarehouseZoneId[] = ['intake', 'sorting', 'racks', 'dispatch']

  it('defines all 4 key facility zones', () => {
    const definedIds = ZONES.map((z) => z.id)
    expectedZones.forEach((id) => {
      expect(definedIds).toContain(id)
    })
  })

  it('provides positive dimensions and valid coordinates for every zone', () => {
    ZONES.forEach((zone) => {
      expect(zone.size[0]).toBeGreaterThan(0)
      expect(zone.size[1]).toBeGreaterThan(0)
      expect(Number.isFinite(zone.center[0])).toBe(true)
      expect(Number.isFinite(zone.center[1])).toBe(true)
      expect(zone.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })

  it('defines a valid closed spline path for parcels', () => {
    expect(PATH_POINTS.length).toBeGreaterThanOrEqual(6)
    PATH_POINTS.forEach(([x, y, z]) => {
      expect(Number.isFinite(x)).toBe(true)
      expect(Number.isFinite(y)).toBe(true)
      expect(Number.isFinite(z)).toBe(true)
      // Height should be on top of conveyor belt level (~0.7)
      expect(y).toBeCloseTo(0.7, 0.1)
    })
  })
})

