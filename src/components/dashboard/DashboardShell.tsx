'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Package,
  LayoutDashboard,
  ScanLine,
  Building2,
  Users,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Truck,
} from 'lucide-react'

interface DashboardShellProps {
  variant: 'admin' | 'warehouse'
  children: React.ReactNode
}

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/shipments', label: 'Shipments', icon: Package },
  { href: '/admin/hubs', label: 'Hubs', icon: Building2 },
  { href: '/admin/users', label: 'Staff', icon: Users },
]

const WAREHOUSE_NAV = [
  { href: '/warehouse', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/warehouse/shipments', label: 'Shipments', icon: Package },
  { href: '/warehouse/scanning', label: 'Scanning', icon: ScanLine },
]

export default function DashboardShell({ variant, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = variant === 'admin' ? ADMIN_NAV : WAREHOUSE_NAV
  const title = variant === 'admin' ? 'Admin' : 'Warehouse'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 border-r flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Logo area */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base no-underline"
            style={{ color: 'var(--color-navy)' }}
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'var(--color-blue)' }}
            >
              <Truck size={14} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <span className="text-sm">
              Ship<span style={{ color: 'var(--color-blue)' }}>delhivery</span>
            </span>
          </Link>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {title} Panel
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  active
                    ? 'text-[var(--color-blue)] bg-[rgb(56_189_248/0.08)]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t space-y-1" style={{ borderColor: 'var(--color-border)' }}>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline text-gray-500 hover:bg-gray-50"
          >
            <ChevronLeft size={14} />
            Back to Site
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 w-full text-left"
            onClick={() => {
              // Phase 4: Implement actual sign out
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b lg:px-6"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {title} Panel
            </p>
          </div>
          <span className="badge badge-blue text-xs">Staff</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

