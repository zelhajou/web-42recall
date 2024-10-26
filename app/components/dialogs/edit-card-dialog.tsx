'use client';

import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

import { Card as CardType } from '@/types/deck';

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardType;
  deckId: string;
  onUpdate: (cardId: string, updates: Partial<CardType>) => Promise<void>;
}
export function EditCardDialog({
  open,
  onOpenChange,
  card,
  deckId,
  onUpdate,
}: EditCardDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    front: card.front,
    back: card.back,
    hint: card.hint || '',
    code: card.code || '',
  });
  useEffect(() => {
    setFormData({
      front: card.front,
      back: card.back,
      hint: card.hint || '',
      code: card.code || '',
    });
  }, [card]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(card.id, {
        front: formData.front.trim(),
        back: formData.back.trim(),
        hint: formData.hint.trim() || null,
        code: formData.code.trim() || null,
      });
      toast({
        title: 'Success',
        description: 'Card updated successfully.',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating card:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update card. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>Make changes to your flashcard.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="front" className="text-sm font-medium">
                Question
              </label>
              <Input
                id="front"
                value={formData.front}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, front: e.target.value }))
                }
                required
                placeholder="Enter the question or front of the card"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="back" className="text-sm font-medium">
                Answer
              </label>
              <Textarea
                id="back"
                value={formData.back}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, back: e.target.value }))
                }
                required
                placeholder="Enter the answer or back of the card"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hint" className="text-sm font-medium">
                Hint (Optional)
              </label>
              <Input
                id="hint"
                value={formData.hint}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hint: e.target.value }))
                }
                placeholder="Add a helpful hint"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Code Example (Optional)
              </label>
              <Textarea
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="Add a code example"
                className="font-mono"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
