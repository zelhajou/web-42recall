import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { StudySession } from '@/components/study/study-session';
import { Deck } from '@/types/deck';
import { transformPrismaDeckToApp } from '@/app/lib/transformers';
interface StudyPageProps {
  params: {
    deckId: string;
  };
}
async function getDeck(deckId: string): Promise<Deck> {
  const prismaData = await prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      cards: {
        orderBy: {
          order: 'asc'
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      },
      tags: true,
      _count: {
        select: { 
          cards: true 
        }
      }
    }
  });
  if (!prismaData) {
    notFound();
  }
  return transformPrismaDeckToApp(prismaData);
}
export default async function StudyPage({ params }: StudyPageProps) {
  const deck = await getDeck(params.deckId);
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <StudySession deck={deck} />
    </div>
  );
}
