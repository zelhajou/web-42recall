// app/(protected)/dashboard/page.tsx
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardMetrics />
    </div>
  );
}