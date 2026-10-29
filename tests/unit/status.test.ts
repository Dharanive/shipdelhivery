import { describe, it, expect } from 'vitest'
import {
  getStatusConfig,
  isTerminalStatus,
  isActiveStatus,
  STATUS_PROGRESS,
} from '@/features/shipments/status'
import type { ShipmentStatus } from '@/types'

describe('Status config', () => {
  const ALL_STATUSES: ShipmentStatus[] = [
    'booked',
    'picked_up',
    'at_origin_hub',
    'sorting',
    'in_transit',
    'at_destination_hub',
    'out_for_delivery',
    'delivered',
    'delivery_failed',
    'exception',
    'returned',
  ]

  it('returns config for every valid status', () => {
    ALL_STATUSES.forEach((status) => {
      const config = getStatusConfig(status)
      expect(config).toBeDefined()
      expect(config.label).toBeTruthy()
      expect(config.badgeClass).toBeTruthy()
      expect(config.Icon).toBeDefined()
    })
  })

  it('has progress value for every status', () => {
    ALL_STATUSES.forEach((status) => {
      expect(STATUS_PROGRESS[status]).toBeGreaterThanOrEqual(0)
      expect(STATUS_PROGRESS[status]).toBeLessThanOrEqual(100)
    })
  })

  it('marks terminal statuses correctly', () => {
    expect(isTerminalStatus('delivered')).toBe(true)
    expect(isTerminalStatus('returned')).toBe(true)
    expect(isTerminalStatus('in_transit')).toBe(false)
    expect(isTerminalStatus('booked')).toBe(false)
  })

  it('marks active statuses correctly', () => {
    expect(isActiveStatus('in_transit')).toBe(true)
    expect(isActiveStatus('sorting')).toBe(true)
    expect(isActiveStatus('booked')).toBe(false) // not started yet
    expect(isActiveStatus('delivered')).toBe(false)
    expect(isActiveStatus('returned')).toBe(false)
  })
})

