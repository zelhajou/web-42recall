import { Card } from "@/components/ui/card";
export function DeckSkeleton() {
  return (
    <Card className="h-full p-6">
      <div className="space-y-4 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="h-6 w-1/2 bg-muted rounded" />
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-2/3 bg-muted rounded" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}
