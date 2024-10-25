import { useState, useCallback } from 'react';
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

  const updateDeck = useCallback(async (updates: Partial<Deck>) => {
    setIsLoading(true);
    try {
      // Optimistically update the UI
      setDeck(prev => ({ ...prev, ...updates }));

      const response = await fetch(`/api/decks/${deck.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update deck');

      toast({
        title: 'Deck updated',
        description: 'Changes saved successfully.',
      });

      router.refresh();
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
  }, [deck.id, refreshDeck, router, toast]);

  const addCards = useCallback(async (cards: Omit<Card, 'id' | 'deckId' | 'createdAt' | 'updatedAt' | 'order'>[]) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deck.id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards }),
      });

      if (!response.ok) throw new Error('Failed to add cards');

      await refreshDeck();
      toast({
        title: 'Cards added',
        description: `Successfully added ${cards.length} cards to the deck.`,
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
  }, [deck.id, refreshDeck, toast]);

  const updateCard = useCallback(async (cardId: string, updates: Partial<Card>) => {
    setIsLoading(true);
    try {
      setDeck(prev => ({
        ...prev,
        cards: prev.cards.map(card => 
          card.id === cardId ? { ...card, ...updates } : card
        ),
      }));

      const response = await fetch(`/api/decks/${deck.id}/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update card');

      toast({
        title: 'Card updated',
        description: 'Changes saved successfully.',
      });

      router.refresh();
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
  }, [deck.id, refreshDeck, router, toast]);

  const deleteCard = useCallback(async (cardId: string) => {
    setIsLoading(true);
    try {
      setDeck(prev => ({
        ...prev,
        cards: prev.cards.filter(card => card.id !== cardId),
        _count: { ...prev._count, cards: prev._count.cards - 1 },
      }));

      const response = await fetch(`/api/decks/${deck.id}/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete card');

      toast({
        title: 'Card deleted',
        description: 'The card has been successfully deleted.',
      });

      router.refresh();
    } catch (error) {
      refreshDeck();
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete card',
      });
    } finally {
      setIsLoading(false);
    }
  }, [deck.id, refreshDeck, router, toast]);

  const reorderCards = useCallback(async (orderedIds: string[]) => {
    try {
      setDeck(prev => ({
        ...prev,
        cards: orderedIds
          .map(id => prev.cards.find(card => card.id === id))
          .filter((card): card is Card => card !== undefined),
      }));

      const response = await fetch(`/api/decks/${deck.id}/cards/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });

      if (!response.ok) throw new Error('Failed to reorder cards');

      toast({
        title: 'Cards reordered',
        description: 'New order saved successfully.',
      });
    } catch (error) {
      refreshDeck();
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reorder cards',
      });
    }
  }, [deck.id, refreshDeck, toast]);

  return {
    deck,
    isLoading,
    refreshDeck,
    updateDeck,
    addCards,
    updateCard,
    deleteCard,
    reorderCards,
  };
}