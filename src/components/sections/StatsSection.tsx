'use client'

import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react'

const STATS = [
  { value: '2.4M+', label: 'Consignments Delivered', icon: Activity, detail: 'Across 48 hub transit corridors' },
  { value: '99.4%', label: 'On-Time Reconciliation', icon: ShieldCheck, detail: 'Automated dock dispatch scans' },
  { value: '520+', label: 'Connected Fleet Trucks', icon: Globe, detail: 'Real-time telemetry tracking' },
  { value: '< 15min', label: 'Cross-Dock Turnaround', icon: Zap, detail: 'High-speed automated sorting' },
]

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STATS.map(({ value, label, icon: Icon, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="p-7 rounded-2xl bg-slate-50/70 border border-slate-200/70 relative overflow-hidden group hover:border-blue-500/40 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center mb-4 text-blue-600">
                <Icon size={18} strokeWidth={2.4} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1 font-mono">
                {value}
              </p>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {label}
              </p>
              <p className="text-xs text-slate-500">
                {detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
