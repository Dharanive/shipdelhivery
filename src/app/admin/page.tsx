import {
  Package,
  Truck,
  Navigation,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
        Admin Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Platform-wide metrics and operational overview.
      </p>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Shipments', value: '—', icon: Package, color: 'var(--color-blue)' },
          { label: 'In Transit', value: '—', icon: Truck, color: 'var(--color-orange)' },
          { label: 'Out for Delivery', value: '—', icon: Navigation, color: 'var(--color-warning)' },
          { label: 'Delivered', value: '—', icon: CheckCircle, color: 'var(--color-success)' },
          { label: 'Exceptions', value: '—', icon: AlertCircle, color: 'var(--color-danger)' },
          { label: 'Recent Events', value: '—', icon: Clock, color: 'var(--color-text-muted)' },
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

      {/* Placeholder sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Recent Tracking Events
          </h3>
          <p className="text-sm py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Connect to Supabase to view live tracking events.
          </p>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Shipment Status Distribution
          </h3>
          <p className="text-sm py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Connect to Supabase to view shipment analytics.
          </p>
        </div>
      </div>
    </div>
  )
}

