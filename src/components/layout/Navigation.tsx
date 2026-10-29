'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Package, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/track', label: 'Tracking' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4">
      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 py-3 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'glass-nav-scrolled'
            : 'glass-nav-light'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 p-[1px] shadow-md shadow-blue-500/20">
            <div className="w-full h-full rounded-[11px] bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Package size={20} className="text-blue-600" strokeWidth={2.4} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-0.5">
              Ship<span className="text-blue-600">delhivery</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400">
              Logistics Fleet 3D
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
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
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ShieldCheck size={14} className="text-blue-600" />
            Staff Portal
          </Link>
          <Link
            href="/track"
            className="btn btn-royal text-xs py-2 px-4 shadow-sm"
          >
            <span>Tracking</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
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
            className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 p-5 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium ${
                    pathname === href
                      ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <Link
                href="/auth/login"
                className="px-4 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Staff Portal</span>
                <ShieldCheck size={16} className="text-blue-600" />
              </Link>
              <Link href="/track" className="btn btn-royal w-full py-3 mt-1">
                <span>Track Parcel Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
