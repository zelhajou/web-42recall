import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PaginationState } from '@/types/deck';

interface PaginationProps {
  pagination: PaginationState;
  onChange: (page: number) => void;
}
export function Pagination({ pagination, onChange }: PaginationProps) {
  const { page, pages } = pagination;
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <div className="text-sm text-muted-foreground">
        Page {page} of {pages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
