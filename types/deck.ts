import { z } from 'zod';
export const searchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(12),
  search: z.string().optional(),
  project: z.string().optional(),
  topic: z.string().optional(),
  sort: z.enum(['updated', 'created', 'alpha', 'cards']).optional().default('updated'),
});
export type SearchParams = z.infer<typeof searchParamsSchema>;
export interface DeckFilters {
    search: string;
    project: string | null;
    topic: string | null;
    sortBy: 'updated' | 'created' | 'alpha' | 'cards';
  }
  export interface PaginationState {
    page: number;
    limit: number;
    total: number;
    pages: number;
  }
export interface DeckFilters {
  search: string;
  project: string | null;
  topic: string | null;
  sortBy: 'updated' | 'created' | 'alpha' | 'cards';
}
export type DeckSortOption = DeckFilters['sortBy'];
export interface Card {
  id: string;
  front: string;
  back: string;
  hint: string | null;
  code: string | null;
  order: number;
  deckId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Tag {
  id: string;
  name: string;
}
export interface User {
  id: string;
  name: string | null;
  image: string | null;
}
export interface Deck {
  id: string;
  title: string;
  description: string | null;
  project: string | null;
  topic: string | null;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
  tags: Tag[];
  user: User;
  _count: {
    cards: number;
  };
}
