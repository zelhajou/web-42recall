import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { z } from 'zod';
const cardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  hint: z.string().optional(),
  code: z.string().optional(),
});
const createCardsSchema = z.object({
  cards: z.array(cardSchema)
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
    const json = await req.json();
    const body = createCardsSchema.parse(json);
    const deck = await prisma.deck.findUnique({
      where: { id: params.deckId },
      select: { userId: true, _count: { select: { cards: true } } }
    });
    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }
    if (deck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const lastOrder = deck._count.cards;
    const cards = await prisma.$transaction(
      body.cards.map((card, index) =>
        prisma.card.create({
          data: {
            ...card,
            order: lastOrder + index,
            deckId: params.deckId,
          }
        })
      )
    );
    return NextResponse.json({ data: cards });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating cards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
