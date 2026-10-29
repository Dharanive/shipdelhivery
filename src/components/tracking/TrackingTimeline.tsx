'use client'

import { motion } from 'motion/react'
import type { PublicTrackingEvent } from '@/types'
import { getStatusConfig } from '@/features/shipments/status'

interface TrackingTimelineProps {
  events: PublicTrackingEvent[]
}

export default function TrackingTimeline({ events }: TrackingTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
        No tracking events recorded yet.
      </p>
    )
  }

  // Display events newest-first
  const sorted = [...events].sort(
    (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  )

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-[15px] top-2 bottom-2 w-[2px]"
        style={{ background: 'var(--color-border)' }}
      />

      <ol className="space-y-0" role="list" aria-label="Tracking events">
        {sorted.map((event, i) => {
          const config = getStatusConfig(event.status)
          const IconComponent = config.Icon
          const isLatest = i === 0
          const date = new Date(event.occurred_at)

          return (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* Dot / icon */}
              <div
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: isLatest ? config.color : 'var(--color-border)',
                  boxShadow: isLatest ? `0 0 12px ${config.color}40` : 'none',
                }}
              >
                <IconComponent
                  size={14}
                  color={isLatest ? '#fff' : 'var(--color-text-muted)'}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p
                    className="font-medium text-sm"
                    style={{ color: isLatest ? 'var(--color-text)' : 'var(--color-text-muted)' }}
                  >
                    {config.label}
                  </p>
                  <time
                    className="text-xs tabular-nums"
                    style={{ color: 'var(--color-text-muted)' }}
                    dateTime={event.occurred_at}
                  >
                    {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })},{' '}
                    {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {event.description}
                </p>
                {event.location && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
                    📍 {event.location}
                  </p>
                )}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

