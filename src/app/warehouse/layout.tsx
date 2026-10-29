import type { Metadata } from 'next'
import DashboardShell from '@/components/dashboard/DashboardShell'

export const metadata: Metadata = {
  title: 'Warehouse Dashboard',
}

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell variant="warehouse">{children}</DashboardShell>
}

