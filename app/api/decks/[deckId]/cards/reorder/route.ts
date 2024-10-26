import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';

const reorderSchema = z.object({
  orderedIds: z.array(z.string()),
});
export async function POST(
  req: Request,
  { params }: { params: { deckId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const deck = await prisma.deck.findUnique({
      where: { id: params.deckId },
      select: { userId: true },
    });
    if (!deck || deck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const json = await req.json();
    const { orderedIds } = reorderSchema.parse(json);
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.card.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error reordering cards:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
