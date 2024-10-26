'use client';
import { useState } from 'react';
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
import type { Card } from '@/types/deck';
type NewCard = Omit<Card, 'id' | 'order' | 'deckId' | 'createdAt' | 'updatedAt'>;
interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
  onAddCards: (cards: NewCard[]) => Promise<void>;
}
interface CardFormData {
  front: string;
  back: string;
  hint: string;
  code: string;
}
export function AddCardDialog({
  open,
  onOpenChange,
  deckId,
  onAddCards,
}: AddCardDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<CardFormData[]>([
    { front: '', back: '', hint: '', code: '' }
  ]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validCards: NewCard[] = cards
        .filter(card => card.front.trim() && card.back.trim())
        .map(card => ({
          front: card.front.trim(),
          back: card.back.trim(),
          hint: card.hint.trim() || null,
          code: card.code.trim() || null
        }));
      if (validCards.length === 0) {
        throw new Error('At least one card is required');
      }
      await onAddCards(validCards);
      setCards([{ front: '', back: '', hint: '', code: '' }]);
      onOpenChange(false);
      toast({
        title: 'Success',
        description: `Added ${validCards.length} cards successfully.`,
      });
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
  const addCard = () => {
    setCards([...cards, { front: '', back: '', hint: '', code: '' }]);
  };
  const updateCard = (index: number, field: keyof CardFormData, value: string) => {
    setCards(cards.map((card, i) => 
      i === index ? { ...card, [field]: value } : card
    ));
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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
