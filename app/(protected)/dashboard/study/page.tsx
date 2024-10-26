// app/(protected)/dashboard/study/page.tsx
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { StudyDashboard } from '@/components/study/study-dashboard';

// app/(protected)/dashboard/study/page.tsx
async function getStudyData(userId: string) {
  const [decks, recentSessions] = await Promise.all([
    // Get decks with study progress
    prisma.deck.findMany({
      where: { userId },
      include: {
        cards: {
          include: {
            progress: {
              where: { userId }
            }
          }
        },
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    }),
    // Get recent study sessions
    prisma.studySession.findMany({
      where: { userId },
      include: {
        deck: {
          select: {
            title: true,
            project: true,
            topic: true
          }
        }
      },
      orderBy: { startTime: 'desc' },
      take: 5
    })
  ]);

  // Get stats separately
  const stats = await prisma.studySession.aggregate({
    where: { userId },
    _count: { _all: true },
    _sum: { cardsStudied: true }
  });

  // Transform the data to ensure cardsStudied is never null
  const transformedData = {
    decks,
    recentSessions,
    stats: {
      _count: stats._count,
      _sum: {
        cardsStudied: stats._sum.cardsStudied ?? 0
      }
    }
  };

  return transformedData;
}

export default async function StudyHomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const data = await getStudyData(session.user.id);
  return <StudyDashboard data={data} />;
}