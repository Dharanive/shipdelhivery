import type { Metadata } from 'next'
import DashboardShell from '@/components/dashboard/DashboardShell'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell variant="admin">{children}</DashboardShell>
}

