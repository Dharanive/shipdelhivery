'use client'

import { useState } from 'react'
import { ScanLine, Package, AlertCircle } from 'lucide-react'

export default function WarehouseScanning() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = trackingNumber.trim().toUpperCase().replace(/[\s\-_]/g, '')
    if (!normalized) {
      setError('Enter or scan a tracking number.')
      return
    }
    setError(null)
    // Phase 5: Implement actual scan logic with Supabase
    setError(
      'Scanning not yet connected. Complete Supabase and auth setup to enable warehouse scanning.'
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgb(56 189 248 / 0.08)' }}
        >
          <ScanLine size={32} style={{ color: 'var(--color-blue)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
          Scan Shipment
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Enter or scan a tracking number to process a shipment at this warehouse.
        </p>
      </div>

      <form onSubmit={handleScan} className="card p-6">
        <label
          htmlFor="scan-input"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          Tracking Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Package
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              id="scan-input"
              type="text"
              value={trackingNumber}
              onChange={(e) => { setTrackingNumber(e.target.value); setError(null) }}
              className="input pl-9 font-mono"
              placeholder="SD123456789"
              autoComplete="off"
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <ScanLine size={16} />
            Scan
          </button>
        </div>

        {error && (
          <div
            className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg text-sm"
            style={{
              background: 'rgb(239 68 68 / 0.06)',
              border: '1px solid rgb(239 68 68 / 0.15)',
              color: 'var(--color-danger)',
            }}
            role="alert"
          >
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
          Tip: Connect a USB barcode scanner — it will type the tracking number and submit
          automatically.
        </p>
      </form>
    </div>
  )
}

