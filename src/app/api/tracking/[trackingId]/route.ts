import { NextRequest, NextResponse } from 'next/server'
import type { TrackingResult, ApiResponse, PublicTrackingEvent, ShipmentStatus } from '@/types'

// ── In-memory rate limiter (simple TTL map) ─────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 20
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count++
  if (entry.count > MAX_REQUESTS) return true
  return false
}

// ── Tracking number validation ──────────────────────────────────────
const TRACKING_RE = /^[A-Z0-9]{8,20}$/

function normalizeTracking(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s\-_]/g, '')
}

// ── Demo data ───────────────────────────────────────────────────────
// This will be replaced by Supabase queries in Phase 3
const DEMO_EVENTS: Record<string, { shipment: TrackingResult['shipment']; events: PublicTrackingEvent[] }> = {
  SD123456789: {
    shipment: {
      tracking_number: 'SD123456789',
      status: 'in_transit',
      estimated_delivery_at: new Date(Date.now() + 2 * 86_400_000).toISOString(),
      created_at: new Date(Date.now() - 3 * 86_400_000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 3_600_000).toISOString(),
      origin_city: 'New Delhi',
      destination_city: 'Mumbai',
      current_location: 'Jaipur Hub',
    },
    events: [
      {
        id: 'evt-1',
        status: 'booked' as ShipmentStatus,
        description: 'Shipment booked by sender.',
        occurred_at: new Date(Date.now() - 3 * 86_400_000).toISOString(),
        location: 'New Delhi',
      },
      {
        id: 'evt-2',
        status: 'picked_up' as ShipmentStatus,
        description: 'Parcel collected from sender address.',
        occurred_at: new Date(Date.now() - 2.8 * 86_400_000).toISOString(),
        location: 'New Delhi',
      },
      {
        id: 'evt-3',
        status: 'at_origin_hub' as ShipmentStatus,
        description: 'Arrived at New Delhi sorting facility.',
        occurred_at: new Date(Date.now() - 2.5 * 86_400_000).toISOString(),
        location: 'New Delhi Hub',
      },
      {
        id: 'evt-4',
        status: 'sorting' as ShipmentStatus,
        description: 'Shipment sorted and loaded for transit.',
        occurred_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
        location: 'New Delhi Hub',
      },
      {
        id: 'evt-5',
        status: 'in_transit' as ShipmentStatus,
        description: 'Departed New Delhi hub, en route to Jaipur.',
        occurred_at: new Date(Date.now() - 1.5 * 86_400_000).toISOString(),
        location: 'En route',
      },
      {
        id: 'evt-6',
        status: 'in_transit' as ShipmentStatus,
        description: 'Arrived at Jaipur transit hub for onward dispatch.',
        occurred_at: new Date(Date.now() - 4 * 3_600_000).toISOString(),
        location: 'Jaipur Hub',
      },
    ],
  },
  SD987654321: {
    shipment: {
      tracking_number: 'SD987654321',
      status: 'delivered',
      estimated_delivery_at: new Date(Date.now() - 1 * 86_400_000).toISOString(),
      created_at: new Date(Date.now() - 5 * 86_400_000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86_400_000).toISOString(),
      origin_city: 'Bangalore',
      destination_city: 'Chennai',
      current_location: 'Chennai',
    },
    events: [
      {
        id: 'evt-d1',
        status: 'booked' as ShipmentStatus,
        description: 'Shipment booked by sender.',
        occurred_at: new Date(Date.now() - 5 * 86_400_000).toISOString(),
        location: 'Bangalore',
      },
      {
        id: 'evt-d2',
        status: 'picked_up' as ShipmentStatus,
        description: 'Parcel collected from sender.',
        occurred_at: new Date(Date.now() - 4.7 * 86_400_000).toISOString(),
        location: 'Bangalore',
      },
      {
        id: 'evt-d3',
        status: 'at_origin_hub' as ShipmentStatus,
        description: 'Arrived at Bangalore sorting facility.',
        occurred_at: new Date(Date.now() - 4.3 * 86_400_000).toISOString(),
        location: 'Bangalore Hub',
      },
      {
        id: 'evt-d4',
        status: 'sorting' as ShipmentStatus,
        description: 'Shipment sorted for Chennai route.',
        occurred_at: new Date(Date.now() - 4 * 86_400_000).toISOString(),
        location: 'Bangalore Hub',
      },
      {
        id: 'evt-d5',
        status: 'in_transit' as ShipmentStatus,
        description: 'In transit to Chennai.',
        occurred_at: new Date(Date.now() - 3 * 86_400_000).toISOString(),
        location: 'En route',
      },
      {
        id: 'evt-d6',
        status: 'at_destination_hub' as ShipmentStatus,
        description: 'Arrived at Chennai hub.',
        occurred_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
        location: 'Chennai Hub',
      },
      {
        id: 'evt-d7',
        status: 'out_for_delivery' as ShipmentStatus,
        description: 'Shipment dispatched for delivery.',
        occurred_at: new Date(Date.now() - 1.2 * 86_400_000).toISOString(),
        location: 'Chennai',
      },
      {
        id: 'evt-d8',
        status: 'delivered' as ShipmentStatus,
        description: 'Delivered to recipient. Signed by: R. Kumar.',
        occurred_at: new Date(Date.now() - 1 * 86_400_000).toISOString(),
        location: 'Chennai',
      },
    ],
  },
  SD555000111: {
    shipment: {
      tracking_number: 'SD555000111',
      status: 'exception',
      estimated_delivery_at: null,
      created_at: new Date(Date.now() - 4 * 86_400_000).toISOString(),
      updated_at: new Date(Date.now() - 0.5 * 86_400_000).toISOString(),
      origin_city: 'Hyderabad',
      destination_city: 'Kolkata',
      current_location: 'Nagpur Hub',
    },
    events: [
      {
        id: 'evt-e1',
        status: 'booked' as ShipmentStatus,
        description: 'Shipment booked.',
        occurred_at: new Date(Date.now() - 4 * 86_400_000).toISOString(),
        location: 'Hyderabad',
      },
      {
        id: 'evt-e2',
        status: 'picked_up' as ShipmentStatus,
        description: 'Parcel collected.',
        occurred_at: new Date(Date.now() - 3.5 * 86_400_000).toISOString(),
        location: 'Hyderabad',
      },
      {
        id: 'evt-e3',
        status: 'in_transit' as ShipmentStatus,
        description: 'In transit to Nagpur hub.',
        occurred_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
        location: 'En route',
      },
      {
        id: 'evt-e4',
        status: 'exception' as ShipmentStatus,
        description: 'Shipment held at Nagpur hub due to address verification.',
        occurred_at: new Date(Date.now() - 0.5 * 86_400_000).toISOString(),
        location: 'Nagpur Hub',
      },
    ],
  },
}

// ── Route handler ───────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
      { status: 429 }
    )
  }

  const { trackingId } = await params
  const normalized = normalizeTracking(trackingId)

  // Validate format
  if (!TRACKING_RE.test(normalized)) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: 'Invalid tracking number format. Must be 8–20 alphanumeric characters.',
        code: 'INVALID_FORMAT',
      },
      { status: 400 }
    )
  }

  // Look up in demo data (will be replaced by Supabase in Phase 3)
  const demo = DEMO_EVENTS[normalized]

  if (!demo) {
    // Safe generic response — do not reveal whether the number exists
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: 'No shipment found for this tracking number. Please check and try again.',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    )
  }

  const result: TrackingResult = {
    shipment: demo.shipment,
    events: demo.events,
    is_demo: true,
  }

  return NextResponse.json<ApiResponse<TrackingResult>>({ success: true, data: result })
}

