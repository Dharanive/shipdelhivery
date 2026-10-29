import { Users, Plus } from 'lucide-react'

export default function AdminUsers() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Staff Management
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Manage staff accounts and role assignments.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" disabled>
          <Plus size={14} />
          Add Staff
        </button>
      </div>

      <div className="card p-8 text-center">
        <Users size={36} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
        <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
          No staff loaded
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Connect Supabase and configure authentication to manage staff.
        </p>
      </div>
    </div>
  )
}

