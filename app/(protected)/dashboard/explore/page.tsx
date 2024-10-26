'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { DeckCard } from '@/components/decks/deck-card';
import { DeckFilters } from '@/components/decks/deck-filters';
import { Pagination } from '@/components/ui/pagination';
import { DeckFilters as DeckFiltersType, PaginationState } from '@/types/deck';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const DEFAULT_FILTERS: DeckFiltersType = {
  search: '',
  project: null,
  topic: null,
  sortBy: 'updated'
};

export default function ExplorePage() {
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
        const queryString = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...(filters.search && { search: filters.search }),
          ...(filters.project && { project: filters.project }),
          ...(filters.topic && { topic: filters.topic }),
          sort: filters.sortBy
        }).toString();

        const response = await fetch(`/api/decks/explore?${queryString}`);
        if (!response.ok) {
          throw new Error('Failed to fetch decks');
        }
        const data = await response.json();
        setDecks(data.data.decks);
        setPagination(data.data.pagination);
      } catch (error) {
        console.error('Error fetching decks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDecks();
  }, [filters, pagination.page, pagination.limit]);

  const createQueryString = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams();
    // Copy current params
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      params.set(key, value);
    });
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    return params.toString();
  };

  const handleFiltersChange = (newFilters: DeckFiltersType) => {
    const updates: Record<string, string | null> = {
      search: newFilters.search || null,
      project: newFilters.project || null,
      topic: newFilters.topic || null,
      sort: newFilters.sortBy,
      page: '1'
    };

    router.push(`${pathname}?${createQueryString(updates)}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage.toString() })}`);
  };

  // Rest of the component remains the same...
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Explore Decks</h1>
        <p className="text-muted-foreground mt-2">
          Discover public flashcard decks shared by the 42 community
        </p>
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
            <Search className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold">No decks found</h2>
            <p className="text-muted-foreground">
              {filters.search || filters.project || filters.topic
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to share a deck with the community!'}
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
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