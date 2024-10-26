import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
export async function POST(
  req: Request,
  { params }: { params: { deckId: string; cardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { isCorrect } = await req.json();
    const progress = await prisma.cardProgress.upsert({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId: params.cardId,
        },
      },
      update: {
        lastReviewed: new Date(),
        repetitions: { increment: 1 },
        nextReview: new Date(), 
      },
      create: {
        userId: session.user.id,
        cardId: params.cardId,
        lastReviewed: new Date(),
        repetitions: 1,
      },
    });
    return NextResponse.json({ data: progress });
  } catch (error) {
    console.error('Error recording study progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
