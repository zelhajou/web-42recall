// types/index.ts
import { Prisma } from '@prisma/client'

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// Custom types for the application
export type DeckWithCards = Prisma.DeckGetPayload<{
  include: {
    cards: true;
    tags: true;
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      }
    }
  }
}>

export type CardWithProgress = Prisma.CardGetPayload<{
  include: {
    progress: true;
  }
}>

export interface StudySessionData {
  deckId: string;
  startTime: Date;
  cardsStudied: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}