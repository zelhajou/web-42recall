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


export interface User {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  front: string;
  back: string;
  hint?: string | null;
  code?: string | null;
  order: number;
  deckId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  title: string;
  description?: string | null;
  project?: string | null;
  topic?: string | null;
  isPublic: boolean;
  userId: string;
  user: User;
  cards: Card[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  _count: {
    cards: number;
  };
}