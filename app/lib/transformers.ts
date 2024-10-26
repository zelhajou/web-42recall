import { Card, Deck, Tag, User } from '@/types/deck';

export function transformPrismaDeckToApp(prismaDeck: any): Deck {
  return {
    id: prismaDeck.id,
    title: prismaDeck.title,
    description: prismaDeck.description,
    project: prismaDeck.project,
    topic: prismaDeck.topic,
    isPublic: prismaDeck.isPublic,
    userId: prismaDeck.userId,
    user: {
      id: prismaDeck.user.id,
      name: prismaDeck.user.name,
      image: prismaDeck.user.image,
    },
    cards: prismaDeck.cards.map((card: any) => ({
      id: card.id,
      front: card.front,
      back: card.back,
      hint: card.hint,
      code: card.code,
      order: card.order,
      deckId: card.deckId,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    })),
    tags: prismaDeck.tags,
    createdAt: prismaDeck.createdAt.toISOString(),
    updatedAt: prismaDeck.updatedAt.toISOString(),
    _count: {
      cards: prismaDeck._count.cards,
    },
  };
}
