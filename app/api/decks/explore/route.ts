
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic'; // This prevents static generation attempts

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const search = searchParams.get('search') || undefined;
    const project = searchParams.get('project') || undefined;
    const topic = searchParams.get('topic') || undefined;
    const sort = searchParams.get('sort') || 'updated';

    // Create base query filter
    const where: Prisma.DeckWhereInput = {
      isPublic: true,
      ...(project && { project }),
      ...(topic && { topic }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode
            }
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode
            }
          }
        ]
      })
    };

    // Create sort order
    const orderBy: Prisma.DeckOrderByWithRelationInput = (() => {
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
    console.error('Error fetching public decks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}