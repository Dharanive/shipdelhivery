'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import {
  ChevronRight,
  RotateCw,
  Compass,
  Layers,
  Sparkles,
  Maximize2,
  MousePointerClick,
  Truck,
  Building2,
  Box,
  Send,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import TrackingForm from '@/components/tracking/TrackingForm'
import type { WarehouseZoneId } from '@/three/WarehouseCamera'

// Dynamically load the 3D scene with SSR disabled for WebGL
const WarehouseScene = dynamic(
  () => import('@/three/WarehouseScene'),
  {
    ssr: false,
    loading: () => <SceneLoadingSkeleton />,
  }
)

function SceneLoadingSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#0B1220]/40">
      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-xs font-mono tracking-wider uppercase text-sky-300">
        Initializing 3D Engine…
      </p>
    </div>
  )
}

const ZONE_BUTTONS: {
  id: WarehouseZoneId
  label: string
  code: string
  icon: React.ElementType
}[] = [
  { id: 'all', label: 'Full Facility', code: 'ALL', icon: Layers },
  { id: 'intake', label: 'Inbound Dock', code: 'Z-01', icon: Truck },
  { id: 'sorting', label: 'Optical Sorter', code: 'Z-02', icon: Box },
  { id: 'racks', label: 'Storage Racks', code: 'Z-03', icon: Building2 },
  { id: 'dispatch', label: 'Outbound Fleet', code: 'Z-04', icon: Send },
]

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [activeZone, setActiveZone] = useState<WarehouseZoneId>('all')
  const [autoRotate, setAutoRotate] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const contentY = useTransform(scrollY, [0, 500], [0, prefersReducedMotion ? 0 : -30])
  const opacity = useTransform(scrollY, [0, 450], [1, 0])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#0B1220]"
    >
      {/* ─────────────────────────────────────────────────────────────
          Full-Bleed World-Class 3D Warehouse Canvas with Mouse Control
      ────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <WarehouseScene
          reducedMotion={prefersReducedMotion}
          activeZone={activeZone}
          autoRotate={autoRotate}
        />
      </div>

      {/* Radial ambient glow accents */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-[1]" />

      {/* Left-side subtle shadow gradient for text contrast */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[60%] bg-gradient-to-r from-[#0B1220]/95 via-[#0B1220]/75 to-transparent pointer-events-none z-[2]" />
      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0B1220] to-transparent pointer-events-none z-[2]" />

      {/* ─────────────────────────────────────────────────────────────
          Interactive 3D Mouse Controls HUD (Top Right)
      ────────────────────────────────────────────────────────────── */}
      <div className="absolute top-24 right-4 sm:right-8 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#0B1220]/80 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 shadow-xl">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-slate-300">
            <MousePointerClick size={13} className="text-sky-400" />
            <span className="hidden sm:inline">Drag to Orbit • Scroll to Zoom</span>
            <span className="sm:hidden">Touch 3D Orbit</span>
          </div>
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              autoRotate
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-md shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Toggle Continuous Turntable Rotation"
          >
            <RotateCw size={12} className={autoRotate ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Auto Spin</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveZone('all')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset Camera to Overview"
          >
            <Maximize2 size={12} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Hero Content Layer (Left Aligned)
      ────────────────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-32 sm:pt-36 pb-12 flex-1 flex flex-col justify-center pointer-events-none"
        style={{ y: contentY, opacity }}
      >
        <div className="max-w-xl pointer-events-auto">
          {/* Status Chip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-sky-400/30 backdrop-blur-md mb-6 shadow-lg shadow-sky-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-sky-300 uppercase font-mono">
              Next-Gen Autonomous Logistics
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 drop-shadow-sm"
          >
            Every Parcel. <br />
            Every Mile. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300">
              In Motion.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-lg"
          >
            Track real-time consignments across smart sorting hubs, automated conveyor routes,
            and confirmed delivery milestones in one connected platform.
          </motion.p>

          {/* World-Class Tracking Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="mb-8"
          >
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-sky-500/20 shadow-2xl shadow-black/60">
              <TrackingForm variant="hero" />
            </div>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <Link
              href="/track"
              className="btn btn-primary text-sm py-3 px-6 shadow-lg shadow-sky-500/30"
            >
              <span>Track Consignment</span>
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/services"
              className="btn btn-secondary text-sm py-3 px-6"
            >
              Explore Network
            </Link>
          </motion.div>

          {/* Interactive 3D Facility Zone Navigator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-3 rounded-2xl bg-[#0B1220]/80 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass size={13} className="text-sky-400" />
                Inspect Facility Zones
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Click zone to fly camera
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {ZONE_BUTTONS.map(({ id, label, code, icon: Icon }) => {
                const isCurrent = activeZone === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveZone(id)}
                    className={`px-2 py-2 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 border ${
                      isCurrent
                        ? 'bg-gradient-to-br from-sky-500/25 to-cyan-500/10 border-sky-400 text-white shadow-md shadow-sky-500/20'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon
                        size={14}
                        className={isCurrent ? 'text-sky-400' : 'text-slate-400'}
                      />
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-black/40 text-slate-300">
                        {code}
                      </span>
                    </div>
                    <span className="text-xs font-semibold leading-tight line-clamp-1">
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
