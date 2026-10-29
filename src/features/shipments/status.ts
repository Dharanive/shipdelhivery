import type { ShipmentStatus } from '@/types'
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Clock,
  SortAsc,
  Navigation,
  Home,
  XCircle,
} from 'lucide-react'

export const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; color: string; badgeClass: string; Icon: React.ElementType; description: string }
> = {
  booked: {
    label: 'Booked',
    color: 'var(--color-text-muted)',
    badgeClass: 'badge-gray',
    Icon: Clock,
    description: 'Shipment has been booked and is awaiting pickup.',
  },
  picked_up: {
    label: 'Picked Up',
    color: 'var(--color-blue)',
    badgeClass: 'badge-blue',
    Icon: Package,
    description: 'Shipment has been collected from the sender.',
  },
  at_origin_hub: {
    label: 'At Origin Hub',
    color: 'var(--color-blue)',
    badgeClass: 'badge-blue',
    Icon: MapPin,
    description: 'Shipment has arrived at the origin sorting facility.',
  },
  sorting: {
    label: 'Sorting',
    color: 'var(--color-orange)',
    badgeClass: 'badge-orange',
    Icon: SortAsc,
    description: 'Shipment is being sorted at the facility.',
  },
  in_transit: {
    label: 'In Transit',
    color: 'var(--color-blue)',
    badgeClass: 'badge-blue',
    Icon: Truck,
    description: 'Shipment is on its way to the destination hub.',
  },
  at_destination_hub: {
    label: 'At Destination Hub',
    color: 'var(--color-blue)',
    badgeClass: 'badge-blue',
    Icon: MapPin,
    description: 'Shipment has arrived at the destination hub.',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'var(--color-orange)',
    badgeClass: 'badge-orange',
    Icon: Navigation,
    description: 'Shipment is out for delivery to the recipient.',
  },
  delivered: {
    label: 'Delivered',
    color: 'var(--color-success)',
    badgeClass: 'badge-green',
    Icon: CheckCircle,
    description: 'Shipment has been successfully delivered.',
  },
  delivery_failed: {
    label: 'Delivery Failed',
    color: 'var(--color-danger)',
    badgeClass: 'badge-red',
    Icon: XCircle,
    description: 'Delivery attempt was unsuccessful.',
  },
  exception: {
    label: 'Exception',
    color: 'var(--color-warning)',
    badgeClass: 'badge-yellow',
    Icon: AlertCircle,
    description: 'There is an exception with this shipment. Our team is investigating.',
  },
  returned: {
    label: 'Returned',
    color: 'var(--color-text-muted)',
    badgeClass: 'badge-gray',
    Icon: RotateCcw,
    description: 'Shipment has been returned to the sender.',
  },
}

export function getStatusConfig(status: ShipmentStatus) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.exception
}

export function isTerminalStatus(status: ShipmentStatus): boolean {
  return ['delivered', 'returned'].includes(status)
}

export function isActiveStatus(status: ShipmentStatus): boolean {
  return !isTerminalStatus(status) && status !== 'booked'
}

// Progress percentage 0–100 for the journey bar
export const STATUS_PROGRESS: Record<ShipmentStatus, number> = {
  booked: 5,
  picked_up: 15,
  at_origin_hub: 28,
  sorting: 38,
  in_transit: 55,
  at_destination_hub: 72,
  out_for_delivery: 88,
  delivered: 100,
  delivery_failed: 88,
  exception: 50,
  returned: 100,
}

// For the home delivery icon reference
const _unused = Home
void _unused

