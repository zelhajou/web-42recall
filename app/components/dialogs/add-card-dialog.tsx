// app/components/dialogs/add-card-dialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
  onCardsAdded?: () => void; // Add this callback
}

export function AddCardDialog({ 
  open, 
  onOpenChange, 
  deckId,
  onCardsAdded 
}: AddCardDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<any[]>([
    { front: '', back: '', hint: '', code: '' }
  ]);

  const addCard = () => {
    setCards([...cards, { front: '', back: '', hint: '', code: '' }]);
  };

  const updateCard = (index: number, field: string, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty cards
      const validCards = cards.filter(card => card.front.trim() && card.back.trim());
      
      if (validCards.length === 0) {
        throw new Error('At least one card is required');
      }

      const response = await fetch(`/api/decks/${deckId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: validCards.map(card => ({
            front: card.front.trim(),
            back: card.back.trim(),
            hint: card.hint.trim() || null,
            code: card.code.trim() || null,
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add cards');
      }

      toast({
        title: 'Cards added',
        description: `Successfully added ${validCards.length} cards to the deck.`,
      });

      // Reset form
      setCards([{ front: '', back: '', hint: '', code: '' }]);
      
      // Close dialog
      onOpenChange(false);
      
      // Trigger refresh
      router.refresh();
      
      // Call the callback if provided
      onCardsAdded?.();
    } catch (error) {
      console.error('Error adding cards:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add cards',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Cards</DialogTitle>
          <DialogDescription>
            Add new cards to your deck. Each card needs a front (question) and back (answer).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="space-y-4 overflow-y-auto flex-1 pr-6 -mr-6">
            {cards.map((card, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Question"
                  value={card.front}
                  onChange={(e) => updateCard(index, 'front', e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Answer"
                  value={card.back}
                  onChange={(e) => updateCard(index, 'back', e.target.value)}
                  required
                />
                <Input
                  placeholder="Hint (optional)"
                  value={card.hint}
                  onChange={(e) => updateCard(index, 'hint', e.target.value)}
                />
                <Textarea
                  placeholder="Code Example (optional)"
                  value={card.code}
                  onChange={(e) => updateCard(index, 'code', e.target.value)}
                  className="font-mono"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addCard}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Card
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Save Cards'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}