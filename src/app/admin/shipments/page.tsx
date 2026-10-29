import { Package, Search, Plus } from 'lucide-react'

export default function AdminShipments() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            All Shipments
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            View, create, and manage all shipments in the system.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search…"
              className="input pl-9 text-sm w-52"
              aria-label="Search shipments"
            />
          </div>
          <button className="btn btn-primary btn-sm" disabled>
            <Plus size={14} />
            New Shipment
          </button>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Package size={36} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
        <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
          No shipments loaded
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Connect Supabase and complete authentication setup to manage shipments.
        </p>
      </div>
    </div>
  )
}

