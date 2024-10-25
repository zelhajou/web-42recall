// app/components/decks/card-skeleton.tsx
import { Card, CardContent } from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-2/3 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}