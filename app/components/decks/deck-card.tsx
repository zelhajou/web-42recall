'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, Code2, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Deck } from '@prisma/client';

interface DeckCardProps {
  deck: any;
}
export function DeckCard({ deck }: DeckCardProps) {
  const getIntraProfileUrl = (username: string) => {
    return `https://profile.intra.42.fr/users/${username}`;
  };
  return (
    <Card className="h-full p-6 hover:shadow-lg transition-shadow">
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold group-hover:text-primary">
            {deck.title}
          </h3>
          {deck.project && (
            <span className="px-2 py-1 text-xs bg-secondary rounded-full">
              {deck.project}
            </span>
          )}
        </div>
        {deck.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {deck.description}
          </p>
        )}
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          {deck.user.image ? (
            <Image
              src={deck.user.image}
              alt={deck.user.name || 'User'}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <a
            href={getIntraProfileUrl(deck.user.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline transition-colors"
          >
            {deck.user.name || 'Anonymous'}
          </a>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Book className="w-4 h-4" />
          {deck._count.cards} cards
        </div>
        {deck.topic && (
          <div className="flex items-center gap-1">
            <Code2 className="w-4 h-4" />
            {deck.topic}
          </div>
        )}
      </div>

      {deck.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {deck.tags.map((tag: any) => (
            <span 
              key={tag.id}
              className="px-2 py-1 text-xs bg-muted rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <Link href={`/dashboard/decks/${deck.id}/study`}>
          <Button variant="outline" size="sm">
            Study Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(deck.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  </Card>
  );
}
