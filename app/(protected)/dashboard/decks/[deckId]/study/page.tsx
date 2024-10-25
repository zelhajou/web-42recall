// app/(protected)/dashboard/decks/[deckId]/study/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { StudySession } from '@/components/study/study-session';

interface StudyPageProps {
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

export default async function StudyPage({ params }: StudyPageProps) {
  const deck = await getDeck(params.deckId);

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <StudySession deck={deck} />
    </div>
  );
}