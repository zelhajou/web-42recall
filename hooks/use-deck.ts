import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useToast } from '@/components/ui/use-toast';

import { Card, Deck } from '@/types/deck';

export function useDeck(initialDeck: Deck) {
  const router = useRouter();
  const { toast } = useToast();
  const [deck, setDeck] = useState(initialDeck);
  const [isLoading, setIsLoading] = useState(false);
  const refreshDeck = useCallback(async () => {
    try {
      const response = await fetch(`/api/decks/${deck.id}`);
      if (!response.ok) throw new Error('Failed to fetch deck');
      const data = await response.json();
      setDeck(data.data);
    } catch (error) {
      console.error('Error refreshing deck:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to refresh deck data',
      });
    }
  }, [deck.id, toast]);
  const updateDeck = useCallback(
    async (updates: Partial<Deck>) => {
      setIsLoading(true);
      try {
        setDeck((prev) => ({
          ...prev,
          ...updates,
          _count: prev._count,
        }));
        const response = await fetch(`/api/decks/${deck.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update deck');
        const data = await response.json();
        setDeck((prev) => ({
          ...prev,
          ...data.data,
          _count: data.data._count || prev._count,
        }));
        toast({
          title: 'Success',
          description: 'Deck updated successfully.',
        });
      } catch (error) {
        refreshDeck();
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update deck',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [deck.id, refreshDeck, toast]
  );
  const updateCard = useCallback(
    async (cardId: string, updates: Partial<Card>) => {
      setIsLoading(true);
      try {
        setDeck((prev) => ({
          ...prev,
          cards: prev.cards.map((card) =>
            card.id === cardId ? { ...card, ...updates } : card
          ),
        }));
        const response = await fetch(`/api/decks/${deck.id}/cards/${cardId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update card');
        const data = await response.json();
        setDeck((prev) => ({
          ...prev,
          cards: prev.cards.map((card) =>
            card.id === cardId ? data.data : card
          ),
        }));
        toast({
          title: 'Success',
          description: 'Card updated successfully.',
        });
      } catch (error) {
        refreshDeck();
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update card',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [deck.id, refreshDeck, toast]
  );
  const addCards = useCallback(
    async (
      newCards: Omit<
        Card,
        'id' | 'deckId' | 'createdAt' | 'updatedAt' | 'order'
      >[]
    ) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/decks/${deck.id}/cards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cards: newCards }),
        });
        if (!response.ok) throw new Error('Failed to add cards');
        const data = await response.json();
        setDeck((prev) => ({
          ...prev,
          cards: [...prev.cards, ...data.data],
          _count: {
            ...prev._count,
            cards: prev._count.cards + data.data.length,
          },
        }));
        toast({
          title: 'Success',
          description: `Added ${newCards.length} cards successfully.`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add cards',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [deck.id, toast]
  );
  const reorderCards = useCallback(
    async (orderedIds: string[]) => {
      setIsLoading(true);
      try {
        setDeck((prev) => ({
          ...prev,
          cards: orderedIds
            .map((id) => prev.cards.find((card) => card.id === id))
            .filter(
              (card): card is (typeof prev.cards)[0] => card !== undefined
            ),
        }));
        const response = await fetch(`/api/decks/${deck.id}/cards/reorder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds }),
        });
        if (!response.ok) throw new Error('Failed to reorder cards');
        const data = await response.json();
        setDeck((prev) => ({
          ...prev,
          cards: data.data,
        }));
        toast({
          title: 'Success',
          description: 'Cards reordered successfully.',
        });
      } catch (error) {
        refreshDeck();
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to reorder cards',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [deck.id, refreshDeck, toast]
  );
  return {
    deck,
    isLoading,
    updateDeck,
    updateCard,
    addCards,
    reorderCards,
  };
}
