import Link from 'next/link'
import { Package, Mail, MapPin, ShieldCheck } from 'lucide-react'

const LINKS = {
  solutions: [
    { href: '/services', label: 'Inter-City Linehaul' },
    { href: '/services', label: 'Automated Sorting Hubs' },
    { href: '/services', label: 'Last-Mile Delivery' },
    { href: '/services', label: 'Enterprise Dispatch' },
  ],
  platform: [
    { href: '/track', label: 'Consignment Tracking' },
    { href: '/warehouse', label: 'Warehouse Staff Terminal' },
    { href: '/admin', label: 'Command Operations' },
    { href: '/auth/login', label: 'Staff Login' },
  ],
  compliance: [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Operation' },
    { href: '#', label: 'Security & RLS Policies' },
    { href: '#', label: 'API Documentation' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] border-t border-slate-800 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[1px]">
                <div className="w-full h-full rounded-[11px] bg-[#0B1220] flex items-center justify-center">
                  <Package size={18} className="text-sky-400" strokeWidth={2.4} />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Ship<span className="text-blue-500">delhivery</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm mb-6">
              Connected logistics platform featuring real-time telemetry, 3D facility digital twins,
              and automated parcel reconciliation across India.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-400" />
                <span>Central Logistics Hub, New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400" />
                <span>operations@shipdelhivery.in</span>
              </div>
            </div>
          </div>

          {/* Solution Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-4">
              Infrastructure
            </h4>
            <ul className="space-y-2.5 text-sm">
              {LINKS.solutions.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              {LINKS.platform.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-4">
              Governance
            </h4>
            <ul className="space-y-2.5 text-sm">
              {LINKS.compliance.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} ShipDelhivery. Platform prototype & development architecture.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>RLS Enforced</span>
            </span>
            <span>•</span>
            <span>Three.js WebGL</span>
            <span>•</span>
            <span>Scroll Director Active</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
