// app/contexts/deck-context.tsx
'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface DeckState {
  decks: any[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    project: string | null;
    topic: string | null;
    sortBy: 'updated' | 'created' | 'alpha' | 'cards';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

type DeckAction =
  | { type: 'SET_DECKS'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<DeckState['filters']> }
  | { type: 'SET_PAGINATION'; payload: Partial<DeckState['pagination']> };

const DeckContext = createContext<{
  state: DeckState;
  dispatch: React.Dispatch<DeckAction>;
} | null>(null);

const initialState: DeckState = {
  decks: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    project: null,
    topic: null,
    sortBy: 'updated'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  }
};

function deckReducer(state: DeckState, action: DeckAction): DeckState {
  switch (action.type) {
    case 'SET_DECKS':
      return { ...state, decks: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      };
    case 'SET_PAGINATION':
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload }
      };
    default:
      return state;
  }
}

export function DeckProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(deckReducer, initialState);

  return (
    <DeckContext.Provider value={{ state, dispatch }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
}