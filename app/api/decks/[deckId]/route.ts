// app/api/decks/[deckId]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { z } from 'zod';

const updateDeckSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  project: z.string().optional(),
  topic: z.string().optional(),
  isPublic: z.boolean()
});

export async function PATCH(
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
      select: { userId: true }
    });

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    if (deck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const body = updateDeckSchema.parse(json);

    const updatedDeck = await prisma.deck.update({
      where: { id: params.deckId },
      data: {
        title: body.title,
        description: body.description,
        project: body.project,
        topic: body.topic,
        isPublic: body.isPublic,
      },
      include: {
        cards: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({ data: updatedDeck });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating deck:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
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
      select: { userId: true }
    });

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    if (deck.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.deck.delete({
      where: { id: params.deckId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deck:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}export async function GET(
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
      include: {
        cards: {
          orderBy: {
            order: 'asc'
          }
        },
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: { cards: true }
        }
      }
    });

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    if (deck.userId !== session.user.id && !deck.isPublic) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ data: deck });
  } catch (error) {
    console.error('Error fetching deck:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}