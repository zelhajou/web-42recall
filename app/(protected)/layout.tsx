// app/(protected)/layout.tsx
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/lib/auth'
import { DashboardLayout } from '@/components/dashboard/layout'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}