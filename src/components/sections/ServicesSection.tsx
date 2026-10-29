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
} from 'lucide-react'

const SERVICES = [
  {
    icon: Truck,
    title: 'Inter-City Linehaul Fleet',
    description:
      'High-velocity delivery trucks connecting central distribution hubs to city depots with real-time route telemetry.',
    tag: 'Fleet Network',
  },
  {
    icon: Building2,
    title: 'Automated Sorting Hubs',
    description:
      'Architectural cross-dock facilities with optical laser scanning tunnels, high-speed divert conveyors, and zone routing.',
    tag: 'Sorting Deck',
  },
  {
    icon: Package,
    title: 'Last-Mile Delivery',
    description:
      'Doorstep delivery with confirmed milestone timestamps, recipient handoffs, and instant digital proof of delivery.',
    tag: 'Doorstep',
  },
  {
    icon: ScanLine,
    title: 'Optical Laser Dimensioning',
    description:
      'Multi-axis conveyor scanning tunnels measuring package weight and volume to optimize fleet payload distribution.',
    tag: 'Automated Scan',
  },
  {
    icon: Globe,
    title: 'National Hub Infrastructure',
    description:
      'Spanning major metros and commercial corridors across India with scheduled departure windows.',
    tag: 'Coverage',
  },
  {
    icon: Building2,
    title: 'Enterprise Dispatch Operations',
    description:
      'Dedicated warehouse queues, barcode scanning terminals, role authorization, and complete audit history.',
    tag: 'Enterprise',
  },
]

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
          ref={ref}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-blue-50 border border-blue-200 text-blue-700 mb-4">
            End-To-End Infrastructure
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Autonomous Logistics, <br />
            <span className="text-blue-600">
              Synchronized in Real Time
            </span>
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            From the warehouse conveyor bridge into the freight delivery truck, every confirmed
            milestone is recorded and verified.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SERVICES.map(({ icon: Icon, title, description, tag }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 + i * 0.07, duration: 0.5 }}
              className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-900/3 hover:shadow-xl hover:shadow-blue-500/8 hover:border-blue-500/40 transition-all group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Icon size={22} strokeWidth={2.4} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="btn btn-outline py-3 px-6 text-sm inline-flex items-center gap-2"
          >
            <span>View All Operational Capabilities</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
