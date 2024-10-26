export interface StudySession {
    id: string;
    deckId: string;
    startTime: string;
    endTime: string | null;
    cardsStudied: number;
    deck: {
      title: string;
      project: string | null;
      topic: string | null;
    };
  }
  export interface CardProgress {
    id: string;
    lastReviewed: string;
    nextReview: string;
  }
  export interface DeckWithProgress {
    id: string;
    title: string;
    project: string | null;
    topic: string | null;
    _count: {
      cards: number;
    };
    cards: Array<{
      id: string;
      progress: CardProgress[];
    }>;
  }
  export interface StudyStats {
    _count: {
      _all: number;
    };
    _sum: {
      cardsStudied: number;
    };
  }
  export interface StudyDashboardData {
    decks: DeckWithProgress[];
    recentSessions: StudySession[];
    stats: StudyStats;
  }
