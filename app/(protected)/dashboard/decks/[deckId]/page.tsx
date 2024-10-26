import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { DeckDetails } from '@/components/decks/deck-details';
import { Deck } from '@/types/deck';
interface PageProps {
  params: {
    deckId: string;
  };
}
async function getDeck(deckId: string): Promise<Deck> {
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
  return {
    ...deck,
    createdAt: deck.createdAt.toISOString(),
    updatedAt: deck.updatedAt.toISOString(),
    cards: deck.cards.map(card => ({
      ...card,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString()
    }))
  };
}
export default async function DeckPage({ params }: PageProps) {
  const deck = await getDeck(params.deckId);
  return <DeckDetails deck={deck} />;
}
