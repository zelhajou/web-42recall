// app/(protected)/dashboard/decks/[deckId]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { DeckDetails } from '@/components/decks/deck-details';

interface PageProps {
  params: {
    deckId: string;
  };
}

async function getDeck(deckId: string) {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
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
    notFound();
  }

  return deck;
}

export default async function DeckPage({ params }: PageProps) {
  const deck = await getDeck(params.deckId);
  
  return <DeckDetails deck={deck} />;
}