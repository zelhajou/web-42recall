// app/components/decks/deck-form.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, X, Upload, Eye } from 'lucide-react';

const COMMON_42_PROJECTS = [
  'Libft',
  'ft_printf',
  'get_next_line',
  'Born2beroot',
  'FdF',
  'minitalk',
  'push_swap',
  'minishell',
  'philosophers',
  'NetPractice',
  'cub3d/miniRT',
  'CPP Modules',
  'inception',
  'ft_irc',
  'ft_transcendence'
] as const;

const TOPICS = [
  'C Functions',
  'System Calls',
  'Data Structures',
  'Algorithms',
  'Shell Commands',
  'Networking',
  'Memory Management',
  'Process Management',
  'Docker',
  'Git Commands',
  'Project Tips',
  'Common Errors'
] as const;

interface Card {
  front: string;
  back: string;
  hint?: string;
  code?: string;
}

export function FortyTwoDeckForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    topic: '',
    isPublic: true,
    cards: [] as Card[]
  });
  const [currentCard, setCurrentCard] = useState<Card>({
    front: '',
    back: '',
    hint: '',
    code: ''
  });

  const addCard = () => {
    if (currentCard.front && currentCard.back) {
      setFormData(prev => ({
        ...prev,
        cards: [...prev.cards, currentCard]
      }));
      setCurrentCard({ front: '', back: '', hint: '', code: '' });
    }
  };

  const removeCard = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.cards.length === 0) {
        throw new Error('Add at least one card to create a deck');
      }

      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          project: formData.project,
          topic: formData.topic,
          isPublic: formData.isPublic,
          cards: formData.cards.map(card => ({
            front: card.front,
            back: card.back,
            hint: card.hint || undefined,
            code: card.code || undefined
          }))
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create deck');
      }

      const { data } = await response.json();
      router.push(`/dashboard/decks/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating deck:', error);
      // You might want to add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Deck Title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            value={formData.project}
            onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_42_PROJECTS.map((project) => (
                <SelectItem key={project} value={project.toLowerCase()}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.topic}
            onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic.toLowerCase()}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Deck Description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isPublic}
            onCheckedChange={checked => setFormData(prev => ({ ...prev, isPublic: checked }))}
          />
          <label>Share with other 42 students</label>
        </div>

        {/* Card Creation */}
        <Card>
          <CardContent className="space-y-4 pt-4">
            <Input
              placeholder="Question (e.g., What does malloc return on error?)"
              value={currentCard.front}
              onChange={e => setCurrentCard(prev => ({ ...prev, front: e.target.value }))}
            />
            <Textarea
              placeholder="Answer"
              value={currentCard.back}
              onChange={e => setCurrentCard(prev => ({ ...prev, back: e.target.value }))}
            />
            <Input
              placeholder="Hint (e.g., Think about null pointer)"
              value={currentCard.hint || ''}
              onChange={e => setCurrentCard(prev => ({ ...prev, hint: e.target.value }))}
            />
            <Textarea
              placeholder="Code Example (optional)"
              className="font-mono text-sm"
              value={currentCard.code || ''}
              onChange={e => setCurrentCard(prev => ({ ...prev, code: e.target.value }))}
            />
            <Button
              type="button"
              onClick={addCard}
              disabled={!currentCard.front || !currentCard.back}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </CardContent>
        </Card>

        {/* Cards Preview */}
        {formData.cards.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Cards ({formData.cards.length})</h3>
            <div className="space-y-2">
              {formData.cards.map((card, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="font-medium">{card.front}</p>
                      <p className="text-sm text-muted-foreground">{card.back}</p>
                      {card.hint && (
                        <p className="text-sm text-muted-foreground italic">Hint: {card.hint}</p>
                      )}
                      {card.code && (
                        <pre className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto">
                          {card.code}
                        </pre>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCard(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading || formData.cards.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Deck'
            )}
          </Button>
        </div>
      </form>

      {formData.cards.length === 0 && (
        <Alert>
          <AlertDescription>
            Start by adding cards about {formData.project || 'your chosen project'}. Include code examples and common pitfalls to help fellow 42 students!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default FortyTwoDeckForm;