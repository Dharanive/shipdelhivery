'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import {
  ChevronRight,
  ArrowRight,
  Compass,
  MousePointerClick,
  Clock,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import TrackingForm from '@/components/tracking/TrackingForm'
import type { WarehouseZoneId } from '@/three/WarehouseCamera'

const WarehouseScene = dynamic(
  () => import('@/three/WarehouseScene'),
  {
    ssr: false,
    loading: () => <SceneLoadingSkeleton />,
  }
)

function SceneLoadingSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]">
      <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
        Loading 3D Logistics Campus…
      </p>
    </div>
  )
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [cameraMode, setCameraMode] = useState<'scroll' | 'orbit'>('scroll')
  const [activeZone] = useState<WarehouseZoneId>('all')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Smooth scroll animations for UI content
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 0.45], [0, -40])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[110vh] bg-[#F8FAFC] overflow-hidden"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. 3D Logistics Campus Canvas (Fixed Background during scroll)
      ────────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        <WarehouseScene
          reducedMotion={prefersReducedMotion}
          activeZone={activeZone}
          useScrollCamera={cameraMode === 'scroll'}
        />

        {/* Soft edge gradients so 3D scene fades cleanly into UI */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[50%] bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent pointer-events-none z-[1]" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none z-[1]" />

        {/* ─────────────────────────────────────────────────────────────
            Interactive Camera Mode Pill (Top Right)
        ────────────────────────────────────────────────────────────── */}
        <div className="absolute top-24 right-4 sm:right-8 z-20 flex items-center gap-2">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-1.5 shadow-lg flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCameraMode('scroll')}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                cameraMode === 'scroll'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass size={13} />
              <span>Scroll Director</span>
            </button>
            <button
              type="button"
              onClick={() => setCameraMode('orbit')}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                cameraMode === 'orbit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MousePointerClick size={13} />
              <span>Free 3D Orbit</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            Floating Telemetry Pill Cards (Inspired by Reference Image 1 & 2)
        ────────────────────────────────────────────────────────────── */}
        {/* Floating Inbound Delivery Status Card (Top-Right Floating) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="hidden lg:flex absolute top-40 right-8 z-10 w-72 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-900/5 flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Live Inbound Telemetry
            </span>
            <span className="badge badge-royal text-[10px] py-0.5 px-2">
              ● IN TRANSIT
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-xs text-slate-600">Shipment TRK-78429</span>
            <span className="font-extrabold text-lg text-slate-900 font-mono">10:24 AM</span>
          </div>
          {/* Mini Barcode Progress Indicator */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
            <div className="w-[72%] h-full bg-blue-600 rounded-full" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Clock size={12} className="text-blue-600" />
            <span>Dock A · Conveyor transfer active</span>
          </p>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Hero Foreground Content Layer
      ────────────────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 -mt-[100vh] min-h-screen flex flex-col justify-center pointer-events-none"
        style={{ opacity: heroTextOpacity, y: heroTextY }}
      >
        <div className="max-w-xl pointer-events-auto pt-20">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span className="text-xs font-bold tracking-wide font-mono uppercase">
              Connected 3D Fleet Network
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-5">
            Logistics Made{' '}
            <span className="inline-flex items-center text-blue-600">
              <ArrowRight className="inline-block mx-1 w-8 h-8 sm:w-12 sm:h-12" strokeWidth={2.8} />
              Easy.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
            Track consignments, explore smarter sorting hubs, and follow every delivery truck
            milestone from warehouse to doorstep in real time.
          </p>

          {/* Clean White Floating Tracking Card */}
          <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-900/5">
            <TrackingForm variant="hero" />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/track" className="btn btn-royal">
              <span>Track Consignment</span>
              <ChevronRight size={16} />
            </Link>
            <Link href="/services" className="btn btn-outline">
              Explore Our Network
            </Link>
          </div>

          {/* Scroll Direction Hint */}
          <div className="mt-10 flex items-center gap-2 text-xs font-mono text-slate-400">
            <div className="w-4 h-6 rounded-full border border-slate-300 flex items-start justify-center p-1">
              <div className="w-1 h-1.5 rounded-full bg-blue-600 animate-bounce" />
            </div>
            <span>Scroll down to navigate facility & moving trucks</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
