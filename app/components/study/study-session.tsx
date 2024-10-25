// app/components/study/study-session.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Code,
  Eye,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Deck } from '@/types/deck';

interface StudySessionProps {
  deck: Deck;
}

export function StudySession({ deck }: StudySessionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    startTime: new Date(),
    cardsStudied: new Set<string>(),
  });

  const currentCard = deck.cards[currentIndex];
  const progress = (currentIndex / deck.cards.length) * 100;

  const handleResponse = async (isCorrect: boolean) => {
    try {
      // Record the response
      await fetch(`/api/decks/${deck.id}/cards/${currentCard.id}/study`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCorrect }),
      });

      // Update stats
      setSessionStats(prev => ({
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        cardsStudied: new Set(prev.cardsStudied).add(currentCard.id),
      }));

      // Move to next card
      if (currentIndex < deck.cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        setShowHint(false);
        setShowCode(false);
      } else {
        // End session
        await endSession();
      }
    } catch (error) {
      console.error('Error recording response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to record response',
      });
    }
  };

  const endSession = async () => {
    try {
      await fetch(`/api/decks/${deck.id}/study-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: sessionStats.startTime,
          endTime: new Date(),
          cardsStudied: sessionStats.cardsStudied.size,
          correctAnswers: sessionStats.correct,
          incorrectAnswers: sessionStats.incorrect,
        }),
      });

      toast({
        title: 'Study Session Complete!',
        description: `You studied ${sessionStats.cardsStudied.size} cards with ${sessionStats.correct} correct answers.`,
      });

      router.push(`/dashboard/decks/${deck.id}`);
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save study session',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/decks/${deck.id}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Deck
        </Button>
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {deck.cards.length}
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Card */}
      <Card className="min-h-[400px]">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Front */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{currentCard.front}</h2>
              
              {currentCard.hint && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
              )}

              {showHint && currentCard.hint && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{currentCard.hint}</p>
                </div>
              )}
            </div>

            {/* Answer */}
            {showAnswer && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <h3 className="font-medium">Answer:</h3>
                  <p>{currentCard.back}</p>
                </div>

                {currentCard.code && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCode(!showCode)}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      {showCode ? 'Hide Code' : 'Show Code'}
                    </Button>

                    {showCode && (
                      <pre className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                        {currentCard.code}
                      </pre>
                    )}
                  </div>
                )}

                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleResponse(false)}
                    className="w-32"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Incorrect
                  </Button>
                  <Button
                    onClick={() => handleResponse(true)}
                    className="w-32"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Correct
                  </Button>
                </div>
              </div>
            )}

            {!showAnswer && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setShowAnswer(true)}
                  className="w-48"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Show Answer
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          Correct: {sessionStats.correct} | Incorrect: {sessionStats.incorrect}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/decks/${deck.id}`)}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          End Session
        </Button>
      </div>
    </div>
  );
}