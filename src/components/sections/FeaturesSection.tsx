'use client'

import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import Link from 'next/link'
import { Shield, Zap, BarChart3, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'

const PILLARS = [
  {
    icon: Shield,
    title: 'PostgreSQL Row-Level Security',
    description:
      'Role-governed database access policies ensuring warehouse staff only access assigned consignment records.',
  },
  {
    icon: Zap,
    title: 'Atomic Event Recording',
    description:
      'Zero-loss transactional updates linking delivery milestone status changes directly to audit logs.',
  },
  {
    icon: BarChart3,
    title: 'Fleet & Dock Telemetry',
    description:
      'Real-time operational dashboards for warehouse intake queues, in-transit fleet coordinates, and hub loading throughput.',
  },
  {
    icon: Clock,
    title: 'Chronological Audit Trail',
    description:
      'Sanitized public tracking timeline with verified checkpoints, timestamps, and origin-to-destination journeys.',
  },
]

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -25 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-blue-50 border border-blue-200 text-blue-700 mb-4">
              Security & Reliability
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Industrial Precision. <br />
              <span className="text-blue-600">
                Connected Operations.
              </span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              ShipDelhivery pairs photorealistic 3D logistics twins with enterprise PostgreSQL
              architecture, guaranteeing strict authorization, zero PII leaks, and verifiable
              auditability.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Zero external paid APIs or commercial licensing fees',
                'GPU-accelerated WebGL with seamless CSS fallback',
                'Scroll-reactive 3D cameras and smooth section transitions',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link href="/track" className="btn btn-royal py-3 px-6 text-sm">
              <span>Experience Real-Time Tracking</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {PILLARS.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center mb-4 text-blue-600">
                  <Icon size={18} strokeWidth={2.4} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
