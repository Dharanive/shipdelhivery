'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import {
  Package,
  Building2,
  ArrowRightLeft,
  Truck,
  MapPinned,
  ScanLine,
  Shield,
  Clock,
  BarChart3,
} from 'lucide-react'

const SERVICES = [
  {
    icon: Package,
    title: 'Parcel Delivery',
    description:
      'Complete pickup-to-doorstep delivery with tracking at every checkpoint. Supports standard, express, and scheduled delivery windows.',
    features: [
      'Real-time status updates',
      'Delivery confirmation with timestamps',
      'Exception and reattempt handling',
    ],
    color: 'var(--color-blue)',
    bg: 'rgb(56 189 248 / 0.08)',
  },
  {
    icon: Building2,
    title: 'Warehouse Sorting',
    description:
      'Automated sorting hubs with conveyor belt systems, barcode scanning, and zone-based routing to minimize transit times.',
    features: [
      'Scan-based reconciliation',
      'Zone routing and load planning',
      'Sorting queue dashboards',
    ],
    color: 'var(--color-orange)',
    bg: 'rgb(251 146 60 / 0.08)',
  },
  {
    icon: ArrowRightLeft,
    title: 'Hub Transfers',
    description:
      'Inter-city line haul between hub facilities with scheduled departure windows, manifest generation, and in-transit tracking.',
    features: [
      'Scheduled departure windows',
      'Manifest generation',
      'Transit verification scans',
    ],
    color: 'var(--color-blue)',
    bg: 'rgb(56 189 248 / 0.08)',
  },
  {
    icon: Truck,
    title: 'Last-Mile Delivery',
    description:
      'Field delivery operations including route planning, recipient notifications, delivery attempt logging, and proof of delivery.',
    features: [
      'Route optimization',
      'Recipient notification',
      'Failed delivery workflows',
    ],
    color: 'var(--color-orange)',
    bg: 'rgb(251 146 60 / 0.08)',
  },
  {
    icon: MapPinned,
    title: 'Network Coverage',
    description:
      'Multi-city hub-and-spoke distribution network spanning major Indian metros with planned expansion to tier-2 cities.',
    features: [
      'Hub-and-spoke architecture',
      'Multi-modal transport',
      'Coverage expansion roadmap',
    ],
    color: 'var(--color-blue)',
    bg: 'rgb(56 189 248 / 0.08)',
  },
  {
    icon: ScanLine,
    title: 'Business Logistics',
    description:
      'Enterprise-grade shipment creation, bulk upload support, automated manifest generation, and dedicated business dashboards.',
    features: [
      'Bulk shipment creation',
      'API integration support',
      'Business analytics dashboard',
    ],
    color: 'var(--color-orange)',
    bg: 'rgb(251 146 60 / 0.08)',
  },
]

const CAPABILITIES = [
  {
    icon: Shield,
    title: 'Secure Operations',
    description:
      'Role-based access control, row-level security, and complete audit trail on every operation.',
  },
  {
    icon: Clock,
    title: '24/7 Tracking',
    description:
      'Round-the-clock shipment visibility with chronological event history and estimated delivery.',
  },
  {
    icon: BarChart3,
    title: 'Operations Analytics',
    description:
      'Live operational dashboards with shipment metrics, exception rates, and throughput monitoring.',
  },
]

export default function ServicesGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <>
      {/* Main services grid */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container" ref={ref}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, description, features, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.5 }}
                className="card p-6 flex flex-col"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4 flex-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {description}
                </p>
                <ul className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform capabilities strip */}
      <section className="section-sm" style={{ background: 'var(--color-navy)' }}>
        <div className="container">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ color: 'var(--color-text-light)' }}
          >
            Platform Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CAPABILITIES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgb(56 189 248 / 0.1)' }}
                >
                  <Icon size={22} style={{ color: 'var(--color-blue)' }} />
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

