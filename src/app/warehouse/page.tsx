import { Package, ArrowDownUp, ScanLine, Truck } from 'lucide-react'

export default function WarehouseDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
        Warehouse Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Overview of your assigned warehouse operations.
      </p>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Incoming', value: '—', icon: Package, color: 'var(--color-blue)' },
          { label: 'Sorting Queue', value: '—', icon: ArrowDownUp, color: 'var(--color-orange)' },
          { label: 'Ready to Dispatch', value: '—', icon: Truck, color: 'var(--color-success)' },
          { label: 'Scanned Today', value: '—', icon: ScanLine, color: 'var(--color-blue)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                {label}
              </p>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Recent Incoming
          </h3>
          <p className="text-sm py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Connect to Supabase to view live incoming shipments.
          </p>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Recent Scans
          </h3>
          <p className="text-sm py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Connect to Supabase to view scan history.
          </p>
        </div>
      </div>
    </div>
  )
}

