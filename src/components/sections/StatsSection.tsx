'use client'

import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react'

const STATS = [
  { value: '2.4M+', label: 'Consignments Tracked', icon: Activity, detail: 'Across 48 hub corridors' },
  { value: '99.2%', label: 'Scan Accuracy', icon: ShieldCheck, detail: 'Laser barcode dimensioning' },
  { value: '450+', label: 'Automated Hubs', icon: Globe, detail: 'Tier-1 & metro coverage' },
  { value: '< 18ms', label: 'Telemetry Latency', icon: Zap, detail: 'Real-time WebSocket sync' },
]

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative py-16 bg-[#0B1220] border-y border-white/5">
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
              className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-sky-500/30 transition-all shadow-xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity text-sky-400">
                <Icon size={44} />
              </div>
              <div className="flex items-center gap-2 mb-2 text-sky-400">
                <Icon size={16} />
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  {label}
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1 font-mono">
                {value}
              </p>
              <p className="text-xs text-slate-400">
                {detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
