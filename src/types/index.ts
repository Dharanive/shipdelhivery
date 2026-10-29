// ─────────────────────────────────────────────
//  Shared domain types for ShipDelhivery
// ─────────────────────────────────────────────

export type ShipmentStatus =
  | 'booked'
  | 'picked_up'
  | 'at_origin_hub'
  | 'sorting'
  | 'in_transit'
  | 'at_destination_hub'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_failed'
  | 'exception'
  | 'returned'

export type UserRole = 'admin' | 'warehouse_staff'

export interface Warehouse {
  id: string
  code: string
  name: string
  city: string
  address: string
  is_active: boolean
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  role: UserRole
  warehouse_id: string | null
  created_at: string
}

export interface Shipment {
  id: string
  tracking_number: string
  sender_name: string
  recipient_name: string
  origin_hub_id: string
  destination_hub_id: string
  current_hub_id: string | null
  status: ShipmentStatus
  estimated_delivery_at: string | null
  delivered_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface TrackingEvent {
  id: string
  shipment_id: string
  status: ShipmentStatus
  warehouse_id: string | null
  description: string
  occurred_at: string
  created_by: string
  created_at: string
}

export interface AuditLog {
  id: string
  actor_id: string
  action: string
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown>
  created_at: string
}

// Public-facing (sanitized) types returned by tracking API
export interface PublicShipment {
  tracking_number: string
  status: ShipmentStatus
  estimated_delivery_at: string | null
  created_at: string
  updated_at: string
  origin_city: string
  destination_city: string
  current_location: string | null
}

export interface PublicTrackingEvent {
  id: string
  status: ShipmentStatus
  description: string
  occurred_at: string
  location: string | null
}

export interface TrackingResult {
  shipment: PublicShipment
  events: PublicTrackingEvent[]
  is_demo: boolean
}

// API response wrapper
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

