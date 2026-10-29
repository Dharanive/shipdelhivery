'use client'

import type { ShipmentStatus } from '@/types'
import { getStatusConfig } from '@/features/shipments/status'

interface StatusBadgeProps {
  status: ShipmentStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = getStatusConfig(status)
  const IconComponent = config.Icon

  return (
    <span
      className={`badge ${config.badgeClass} ${
        size === 'sm' ? 'text-[0.65rem] px-2 py-0.5' : ''
      }`}
    >
      <IconComponent size={size === 'sm' ? 10 : 12} />
      {config.label}
    </span>
  )
}

