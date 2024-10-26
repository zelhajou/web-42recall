// app/(protected)/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { notFound } from 'next/navigation';

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
              studySessions: true
            }
          },
          studySessions: {
            orderBy: {
              startTime: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 6 // Limit to 6 most recent decks
      },
      _count: {
        select: { 
          decks: true,
        }
      }
    }
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