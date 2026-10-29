'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Package, Menu, X, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/track', label: 'Tracking' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4">
      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 py-3 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B1220]/90 backdrop-blur-xl border border-sky-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
            : 'bg-[#0B1220]/60 backdrop-blur-md border border-white/10'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-[1px] shadow-lg shadow-sky-500/30">
            <div className="w-full h-full rounded-[11px] bg-[#0B1220] flex items-center justify-center transition-transform group-hover:scale-105">
              <Package size={20} className="text-sky-400" strokeWidth={2.2} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
              Ship<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">delhivery</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400">
              Logistics 3D
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-cyan-500/10 border border-sky-400/30 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ShieldCheck size={14} className="text-sky-400" />
            Staff Portal
          </Link>
          <Link
            href="/track"
            className="btn btn-primary text-xs py-2 px-4 shadow-sky-500/25"
          >
            <span>Track Parcel</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-[#0B1220]/95 backdrop-blur-2xl border border-sky-500/20 p-5 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium ${
                    pathname === href
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Link
                href="/auth/login"
                className="px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white flex items-center justify-between"
              >
                <span>Staff Portal</span>
                <ShieldCheck size={16} className="text-sky-400" />
              </Link>
              <Link href="/track" className="btn btn-primary w-full py-3 mt-1">
                <span>Track Parcel Now</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
