// app/components/study/study-dashboard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Clock,
  Award,
  Calendar,
  BarChart2,
  PlayCircle,
  ChevronRight,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudyDashboardProps {
  data: {
    decks: any[];
    recentSessions: any[];
    stats: {
      _count: { _all: number };
      _sum: { cardsStudied: number };
    };
  };
}

export function StudyDashboard({ data }: StudyDashboardProps) {
  const router = useRouter();

  // Calculate study streak and other stats
  const totalSessions = data.stats._count._all;
  const totalCardsStudied = data.stats._sum.cardsStudied || 0;
  const averageCardsPerSession = totalSessions
    ? Math.round(totalCardsStudied / totalSessions)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Study Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and continue learning
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cards Studied
                </p>
                <p className="text-2xl font-bold">{totalCardsStudied}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Cards/Session
                </p>
                <p className="text-2xl font-bold">{averageCardsPerSession}</p>
              </div>
              <BarChart2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </p>
                <p className="text-2xl font-bold">0 days</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decks Ready for Review */}
      <Card>
        <CardHeader>
          <CardTitle>Ready for Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.decks.map((deck) => {
              const totalCards = deck._count.cards;
              const studiedCards = deck.cards.filter(
                (card: any) => card.progress.length > 0
              ).length;
              const progress = (studiedCards / totalCards) * 100;

              return (
                <div
                  key={deck.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{deck.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      {deck.project && (
                        <span className="mr-2">{deck.project}</span>
                      )}
                      {deck.topic && <span>{deck.topic}</span>}
                    </div>
                    <div className="w-48">
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/dashboard/decks/${deck.id}/study`)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Study Now
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Study Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{session.deck.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(session.startTime).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    {session.cardsStudied} cards studied
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/dashboard/decks/${session.deckId}/study`)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}