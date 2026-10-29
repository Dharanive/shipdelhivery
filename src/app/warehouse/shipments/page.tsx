import { Package, Search } from 'lucide-react'

export default function WarehouseShipments() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Shipments
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            View and manage shipments at your warehouse.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search by tracking number…"
            className="input pl-9 text-sm"
            aria-label="Search shipments"
          />
        </div>
      </div>

      <div className="card p-8 text-center">
        <Package size={36} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
        <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
          No shipments loaded
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Connect Supabase and configure authentication to view warehouse shipments.
        </p>
      </div>
    </div>
  )
}

