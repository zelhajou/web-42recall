import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
export async function POST(
  req: Request,
  { params }: { params: { deckId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { startTime, endTime, cardsStudied, correctAnswers, incorrectAnswers } = await req.json();
    const studySession = await prisma.studySession.create({
      data: {
        userId: session.user.id,
        deckId: params.deckId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        cardsStudied,
      },
    });
    return NextResponse.json({ data: studySession });
  } catch (error) {
    console.error('Error saving study session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
