'use client';

import Link from 'next/link';

import { ArrowRight, BarChart2, BookOpen, Clock, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardOverviewProps {
  data: any;
}
export function DashboardOverview({ data }: DashboardOverviewProps) {
  const totalCards = data.decks.reduce(
    (sum: number, deck: any) => sum + deck._count.cards,
    0
  );
  const totalStudySessions = data.decks.reduce(
    (sum: number, deck: any) => sum + deck._count.studySessions,
    0
  );
  return (
    <div className="space-y-8">
      {}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {data.name || 'Student'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your learning progress
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Link>
        </Button>
      </div>
      {}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data._count.decks}</div>
            <p className="text-xs text-muted-foreground">
              {totalCards} cards total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Study Sessions
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudySessions}</div>
            <p className="text-xs text-muted-foreground">Across all decks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Study</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.decks.some((deck: any) => deck.studySessions.length > 0)
                ? new Date(
                    data.decks.find(
                      (deck: any) => deck.studySessions.length > 0
                    ).studySessions[0].startTime
                  ).toLocaleDateString()
                : 'No sessions yet'}
            </div>
          </CardContent>
        </Card>
      </div>
      {}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Decks</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/decks">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.decks.map((deck: any) => (
            <Link
              key={deck.id}
              href={`/dashboard/decks/${deck.id}`}
              className="block group"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold group-hover:text-primary">
                      {deck.title}
                    </h3>
                    {deck.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {deck.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {deck._count.cards} cards
                      {deck.project && (
                        <>
                          <span className="mx-2">•</span>
                          {deck.project}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {data.decks.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No decks yet. Create your first deck to get started!
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Deck
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
