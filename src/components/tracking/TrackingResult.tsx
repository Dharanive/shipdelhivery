'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { RefreshCw, AlertCircle, Package, ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'
import type { TrackingResult as TrackingResultType, ApiResponse } from '@/types'
import { getStatusConfig, STATUS_PROGRESS } from '@/features/shipments/status'
import TrackingTimeline from './TrackingTimeline'
import StatusBadge from './StatusBadge'

interface TrackingResultProps {
  trackingId: string
}

export default function TrackingResult({ trackingId }: TrackingResultProps) {
  const [result, setResult] = useState<TrackingResultType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTracking = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(trackingId)}`)
      const data: ApiResponse<TrackingResultType> = await res.json()

      if (!data.success) {
        setError(data.error)
        setResult(null)
      } else {
        setResult(data.data)
      }
    } catch {
      setError('Unable to fetch tracking information. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [trackingId])

  useEffect(() => {
    fetchTracking()
  }, [fetchTracking])

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-blue)', borderTopColor: 'transparent' }}
        />
        <p style={{ color: 'var(--color-text-muted)' }}>Looking up {trackingId}…</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-20 gap-4"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgb(239 68 68 / 0.08)' }}
        >
          <AlertCircle size={28} style={{ color: 'var(--color-danger)' }} />
        </div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          Tracking Unavailable
        </h2>
        <p className="text-center max-w-md" style={{ color: 'var(--color-text-muted)' }}>
          {error}
        </p>
        <div className="flex gap-3 mt-4">
          <Link href="/track" className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} />
            Try Another Number
          </Link>
          <button onClick={fetchTracking} className="btn btn-primary btn-sm">
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  if (!result) return null

  const { shipment, events, is_demo } = result
  const config = getStatusConfig(shipment.status)
  const progress = STATUS_PROGRESS[shipment.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back + Refresh bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/track"
          className="flex items-center gap-1.5 text-sm no-underline"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={14} />
          Back to Track
        </Link>
        <button
          onClick={fetchTracking}
          className="btn btn-ghost btn-sm"
          disabled={loading}
          aria-label="Refresh tracking"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Demo banner */}
      {is_demo && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 text-sm"
          style={{
            background: 'rgb(56 189 248 / 0.06)',
            border: '1px solid rgb(56 189 248 / 0.15)',
            color: 'var(--color-blue)',
          }}
        >
          <Info size={14} />
          This is demo tracking data for development purposes.
        </div>
      )}

      {/* Status card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Tracking Number
            </p>
            <p className="text-lg font-bold font-mono" style={{ color: 'var(--color-text)' }}>
              {shipment.tracking_number}
            </p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: 'var(--color-border)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {config.description}
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Origin', value: shipment.origin_city },
            { label: 'Destination', value: shipment.destination_city },
            {
              label: 'Current Location',
              value: shipment.current_location ?? '—',
            },
            {
              label: 'Est. Delivery',
              value: shipment.estimated_delivery_at
                ? new Date(shipment.estimated_delivery_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—',
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {label}
              </p>
              <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Package size={16} style={{ color: 'var(--color-blue)' }} />
          Shipment Journey
        </h3>
        <TrackingTimeline events={events} />
      </div>
    </motion.div>
  )
}

