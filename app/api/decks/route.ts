// app/api/decks/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { z } from 'zod';

const CardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  hint: z.string().optional(),
  code: z.string().optional(),
});

const createDeckSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  project: z.string().optional(),
  topic: z.string().optional(),
  isPublic: z.boolean().default(false),
  cards: z.array(CardSchema)
});



export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const search = searchParams.get('search') || undefined;
    const project = searchParams.get('project') || undefined;
    const topic = searchParams.get('topic') || undefined;
    const sort = searchParams.get('sort') || 'updated';

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(project && { project }),
      ...(topic && { topic }),
    };

    const orderBy = (() => {
      switch (sort) {
        case 'created':
          return { createdAt: 'desc' };
        case 'alpha':
          return { title: 'asc' };
        case 'cards':
          return {
            cards: {
              _count: 'desc'
            }
          };
        default:
          return { updatedAt: 'desc' };
      }
    })();

    const [decks, total] = await Promise.all([
      prisma.deck.findMany({
        where,
        include: {
          _count: {
            select: { cards: true }
          },
          tags: true,
          user: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.deck.count({ where })
    ]);

    return NextResponse.json({
      data: {
        decks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const body = createDeckSchema.parse(json);

    // Filter out empty strings for optional fields
    const project = body.project?.trim() || null;
    const topic = body.topic?.trim() || null;

    const deck = await prisma.deck.create({
      data: {
        title: body.title,
        description: body.description,
        project: project,
        topic: topic,
        isPublic: body.isPublic,
        userId: session.user.id,
        cards: {
          create: body.cards.map((card, index) => ({
            front: card.front,
            back: card.back,
            hint: card.hint || null,
            code: card.code || null,
            order: index
          }))
        }
      },
      include: {
        cards: true,
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({ data: deck });
  } catch (error) {
    console.error('Error creating deck:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

