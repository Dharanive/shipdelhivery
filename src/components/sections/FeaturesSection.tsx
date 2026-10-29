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
      'Role-governed database access policies ensuring staff only operate on assigned hub consignments.',
  },
  {
    icon: Zap,
    title: 'Sub-Second Event Dispatch',
    description:
      'Atomic database updates linking checkpoint status transitions directly with audit logs.',
  },
  {
    icon: BarChart3,
    title: 'Operational Telemetry',
    description:
      'Live dashboard with hub throughput, sorting queue depth, exception rates, and driver handoffs.',
  },
  {
    icon: Clock,
    title: 'Tamper-Evident History',
    description:
      'Permanent, chronologically ordered tracking timeline with verified location tags.',
  },
]

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-gradient-to-b from-[#0B1220] via-[#0D182B] to-[#0B1220] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -25 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-sky-500/10 border border-sky-400/20 text-sky-400 mb-4">
              Architecture & Security
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Industrial Grade. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300">
                Connected Operations.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              ShipDelhivery bridges modern 3D visualization with production PostgreSQL workflows,
              enforcing server-side validation, zero-trust role policies, and resilient failover.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Zero external paid APIs or commercial licensing fees',
                'WebGL hardware acceleration with accessible CSS-only fallbacks',
                'Reduced-motion accessibility compliance out of the box',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-sky-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link href="/track" className="btn btn-orange py-3 px-6 text-sm">
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
                className="p-6 rounded-2xl bg-slate-900/70 border border-white/5 backdrop-blur-md shadow-xl hover:border-sky-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center mb-4 text-sky-400">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
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
