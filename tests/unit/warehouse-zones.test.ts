import { describe, it, expect } from 'vitest'
import { ZONES } from '@/three/WarehouseFloor'
import { PATH_POINTS } from '@/three/Parcel'
import { ROAD_POINTS } from '@/three/MovingDeliveryTruck'
import { MAIN_ROAD_LOOP, INNER_DELIVERY_LOOP } from '@/three/RoadNetwork'
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
      expect(y).toBeCloseTo(0.7, 0.1)
    })
  })

  it('defines a continuous roadway circuit for moving delivery trucks', () => {
    expect(ROAD_POINTS.length).toBeGreaterThanOrEqual(8)
    ROAD_POINTS.forEach(([x, y, z]) => {
      expect(Number.isFinite(x)).toBe(true)
      expect(Number.isFinite(y)).toBe(true)
      expect(Number.isFinite(z)).toBe(true)
      expect(y).toBeCloseTo(0, 0.05)
    })
  })

  it('defines interconnected highway and inner delivery loops in RoadNetwork', () => {
    expect(MAIN_ROAD_LOOP.length).toBeGreaterThanOrEqual(10)
    expect(INNER_DELIVERY_LOOP.length).toBeGreaterThanOrEqual(5)
    MAIN_ROAD_LOOP.forEach(([x, y, z]) => {
      expect(Number.isFinite(x)).toBe(true)
      expect(Number.isFinite(y)).toBe(true)
      expect(Number.isFinite(z)).toBe(true)
    })
    INNER_DELIVERY_LOOP.forEach(([x, y, z]) => {
      expect(Number.isFinite(x)).toBe(true)
      expect(Number.isFinite(y)).toBe(true)
      expect(Number.isFinite(z)).toBe(true)
    })
  })
})
