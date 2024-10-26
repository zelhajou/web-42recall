import { getServerSession } from 'next-auth/next';
import { notFound } from 'next/navigation';

import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

import { DashboardOverview } from '@/components/dashboard/dashboard-overview';

async function getDashboardData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      decks: {
        include: {
          cards: true,
          _count: {
            select: {
              cards: true,
              studySessions: true,
            },
          },
          studySessions: {
            orderBy: {
              startTime: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 6,
      },
      _count: {
        select: {
          decks: true,
        },
      },
    },
  });
  if (!data) {
    notFound();
  }
  return data;
}
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const dashboardData = await getDashboardData(session.user.id);
  return <DashboardOverview data={dashboardData} />;
}
