// app/(protected)/dashboard/decks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeckCard } from '@/components/decks/deck-card';
import { DeckFilters } from '@/components/decks/deck-filters';
import { Pagination } from '@/components/ui/pagination';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DeckFilters as DeckFiltersType, PaginationState } from '@/types/deck';

const DEFAULT_FILTERS: DeckFiltersType = {
  search: '',
  project: null,
  topic: null,
  sortBy: 'updated'
};

export default function DecksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [decks, setDecks] = useState<any[]>([]);
  const [filters, setFilters] = useState<DeckFiltersType>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const project = searchParams.get('project');
    const topic = searchParams.get('topic');
    const sortBy = (searchParams.get('sort') as DeckFiltersType['sortBy']) || 'updated';

    setFilters({ search, project, topic, sortBy });
    setPagination(prev => ({ ...prev, page }));
  }, [searchParams]);

  useEffect(() => {
    const fetchDecks = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...(filters.search && { search: filters.search }),
          ...(filters.project && { project: filters.project }),
          ...(filters.topic && { topic: filters.topic }),
          sort: filters.sortBy
        });

        const response = await fetch(`/api/decks?${queryParams}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        setDecks(data.data.decks);
        setPagination(data.data.pagination);
      } catch (error) {
        console.error('Error fetching decks:', error);
        // You might want to show an error toast here
      } finally {
        setIsLoading(false);
      }
    };

    fetchDecks();
  }, [filters, pagination.page, pagination.limit]);

  const handleFiltersChange = (newFilters: DeckFiltersType) => {
    const params = new URLSearchParams();

    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    // Copy existing params
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Your Decks</h1>
          <p className="text-muted-foreground">
            Manage and study your flashcard decks
          </p>
        </div>
        
        <Link href="/dashboard/create">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Deck
          </Button>
        </Link>
      </div>

      <DeckFilters filters={filters} onChange={handleFiltersChange} />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[200px] animate-pulse" />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="max-w-sm mx-auto space-y-4">
            <h2 className="text-xl font-semibold">No decks found</h2>
            <p className="text-muted-foreground">
              {filters.search || filters.project || filters.topic
                ? 'Try adjusting your filters'
                : 'Create your first deck to start studying!'}
            </p>
            {!filters.search && !filters.project && !filters.topic && (
              <Link href="/dashboard/create">
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Your First Deck
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Link 
                key={deck.id} 
                href={`/dashboard/decks/${deck.id}`}
                className="group"
              >
                <DeckCard deck={deck} />
              </Link>
            ))}
          </div>

          <Pagination 
            pagination={pagination}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}