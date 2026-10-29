import { describe, it, expect } from 'vitest'

const TRACKING_RE = /^[A-Z0-9]{8,20}$/

function normalizeTracking(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s\-_]/g, '')
}

describe('Tracking number validation', () => {
  it('accepts valid tracking numbers', () => {
    const valid = ['SD123456789', 'SD987654321', 'SD555000111', 'ABCDEFGH', 'A1B2C3D4E5F6']
    valid.forEach((tn) => {
      const normalized = normalizeTracking(tn)
      expect(TRACKING_RE.test(normalized)).toBe(true)
    })
  })

  it('normalizes whitespace, hyphens, and underscores', () => {
    expect(normalizeTracking('  sd-123-456-789  ')).toBe('SD123456789')
    expect(normalizeTracking('sd_987_654_321')).toBe('SD987654321')
    expect(normalizeTracking('sd 555 000 111')).toBe('SD555000111')
  })

  it('rejects tracking numbers shorter than 8 chars', () => {
    expect(TRACKING_RE.test(normalizeTracking('SD12345'))).toBe(false)
    expect(TRACKING_RE.test(normalizeTracking('AB'))).toBe(false)
  })

  it('rejects tracking numbers longer than 20 chars', () => {
    expect(TRACKING_RE.test(normalizeTracking('A'.repeat(21)))).toBe(false)
  })

  it('rejects tracking numbers with special characters', () => {
    expect(TRACKING_RE.test(normalizeTracking('SD12345@789'))).toBe(false)
    expect(TRACKING_RE.test(normalizeTracking('SD12345#789'))).toBe(false)
  })

  it('rejects empty strings', () => {
    expect(TRACKING_RE.test(normalizeTracking(''))).toBe(false)
    expect(TRACKING_RE.test(normalizeTracking('   '))).toBe(false)
  })
})

