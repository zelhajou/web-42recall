// app/api/decks/[deckId]/cards/[cardId]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { z } from 'zod';

const updateCardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  hint: z.string().optional(),
  code: z.string().optional(),
  order: z.number().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { deckId: string; cardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deck = await prisma.deck.findUnique({
      where: { id: params.deckId },
      select: { userId: true }
    });

    if (!deck || deck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const body = updateCardSchema.parse(json);

    const card = await prisma.card.update({
      where: { id: params.cardId },
      data: body
    });

    return NextResponse.json({ data: card });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { deckId: string; cardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deck = await prisma.deck.findUnique({
      where: { id: params.deckId },
      select: { userId: true }
    });

    if (!deck || deck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.card.delete({
      where: { id: params.cardId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}