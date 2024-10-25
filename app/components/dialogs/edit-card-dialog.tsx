// app/components/dialogs/edit-card-dialog.tsx
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/types/deck';

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card;
  deckId: string;
}

export function EditCardDialog({
  open,
  onOpenChange,
  card,
  deckId,
}: EditCardDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    front: card.front,
    back: card.back,
    hint: card.hint || '',
    code: card.code || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/decks/${deckId}/cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          front: formData.front.trim(),
          back: formData.back.trim(),
          hint: formData.hint.trim() || null,
          code: formData.code.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      toast({
        title: 'Card updated',
        description: 'The card has been successfully updated.',
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating card:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update card',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>
            Update the card's content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Input
              placeholder="Question"
              value={formData.front}
              onChange={e => setFormData(prev => ({ ...prev, front: e.target.value }))}
              required
            />
            <Textarea
              placeholder="Answer"
              value={formData.back}
              onChange={e => setFormData(prev => ({ ...prev, back: e.target.value }))}
              required
            />
            <Input
              placeholder="Hint (optional)"
              value={formData.hint}
              onChange={e => setFormData(prev => ({ ...prev, hint: e.target.value }))}
            />
            <Textarea
              placeholder="Code Example (optional)"
              value={formData.code}
              onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
              className="font-mono"
            />
          </div>

          <div className="flex justify-end gap-2">
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