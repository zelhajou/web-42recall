import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Deck } from '@/types/deck';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function convertPrismaDatesToStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (obj instanceof Date) {
    return obj.toISOString() as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertPrismaDatesToStrings) as unknown as T;
  }
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertPrismaDatesToStrings(value);
    }
    return converted;
  }
  return obj;
}
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
      cards: prismaDeck._count.cards
    }
  };
}
