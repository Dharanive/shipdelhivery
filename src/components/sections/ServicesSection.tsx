'use client'

import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import Link from 'next/link'
import {
  Package,
  Building2,
  ArrowRight,
  Truck,
  Globe,
  ScanLine,
  ArrowUpRight,
} from 'lucide-react'

const SERVICES = [
  {
    icon: Package,
    title: 'Parcel Delivery & Last-Mile',
    description:
      'High-velocity door-to-door delivery with milestone confirmation, geo-fenced handovers, and recipient notifications.',
    gradient: 'from-sky-500/20 to-blue-500/5',
    border: 'hover:border-sky-500/40',
    iconColor: 'text-sky-400',
  },
  {
    icon: Building2,
    title: 'Intelligent Sorting Hubs',
    description:
      'Automated cross-dock facilities with optical laser scanning, high-speed divert conveyors, and zone load balancing.',
    gradient: 'from-amber-500/20 to-orange-500/5',
    border: 'hover:border-amber-500/40',
    iconColor: 'text-amber-400',
  },
  {
    icon: Truck,
    title: 'Linehaul & Hub Transfers',
    description:
      'Scheduled inter-city truck networks with manifest reconciliation, sealed trailer tracking, and dynamic routing.',
    gradient: 'from-cyan-500/20 to-teal-500/5',
    border: 'hover:border-cyan-500/40',
    iconColor: 'text-cyan-400',
  },
  {
    icon: ScanLine,
    title: 'Barcode & RFID Ingestion',
    description:
      'Multi-axis laser dimensioners and high-speed tunnel scanners ensuring instant consignment verification.',
    gradient: 'from-indigo-500/20 to-violet-500/5',
    border: 'hover:border-indigo-500/40',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Globe,
    title: 'National Distribution Network',
    description:
      'Spanning Tier-1 hubs and emerging commercial clusters across India with sub-24hr transit corridors.',
    gradient: 'from-emerald-500/20 to-teal-500/5',
    border: 'hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Building2,
    title: 'Enterprise B2B Logistics',
    description:
      'Bulk manifest creation, automated dispatch schedules, dedicated staff queues, and comprehensive audit logs.',
    gradient: 'from-rose-500/20 to-pink-500/5',
    border: 'hover:border-rose-500/40',
    iconColor: 'text-rose-400',
  },
]

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-[#0B1220] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
          ref={ref}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-sky-500/10 border border-sky-400/20 text-sky-400 mb-4">
            Network Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Autonomous Logistics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              Engineered for Scale
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            From the initial loading dock scan to the final recipient signature, every stage of
            the parcel journey is synchronized.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SERVICES.map(({ icon: Icon, title, description, gradient, border, iconColor }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 + i * 0.07, duration: 0.5 }}
              className={`p-7 rounded-2xl bg-gradient-to-b ${gradient} bg-slate-900/60 border border-white/5 backdrop-blur-md transition-all group ${border} shadow-xl hover:-translate-y-1`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <Icon size={22} className={iconColor} strokeWidth={2.2} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="btn btn-secondary py-3 px-6 text-sm inline-flex items-center gap-2"
          >
            <span>Explore All Capabilities</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
