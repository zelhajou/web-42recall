'use client';

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Card as CardType } from '@/types/deck';

import { CardSkeleton } from './card-skeleton';

interface SortableCardProps {
  card: CardType;
  index: number;
  onEdit: (card: CardType) => void;
  onDelete: (card: CardType) => void;
  isLoading?: boolean;
}
function SortableCard({
  card,
  index,
  onEdit,
  onDelete,
  isLoading,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  if (isLoading) {
    return <CardSkeleton />;
  }
  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-4">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 px-4">
              <p className="font-medium">Question {index + 1}</p>
              <p>{card.front}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(card)}>
                  Edit Card
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(card)}
                  className="text-destructive"
                >
                  Delete Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1">
            <p className="font-medium">Answer</p>
            <p className="text-muted-foreground">{card.back}</p>
          </div>
          {card.hint && (
            <div className="space-y-1">
              <p className="font-medium">Hint</p>
              <p className="text-sm text-muted-foreground italic">
                {card.hint}
              </p>
            </div>
          )}
          {card.code && (
            <div className="space-y-1">
              <p className="font-medium">Code Example</p>
              <pre className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto">
                {card.code}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
interface ReorderableCardListProps {
  cards: CardType[];
  deckId: string;
  onEdit: (card: CardType) => void;
  onDelete: (card: CardType) => void;
  onReorder?: (orderedIds: string[]) => void;
  isLoading?: boolean;
}
export function ReorderableCardList({
  cards,
  deckId,
  onEdit,
  onDelete,
  onReorder,
  isLoading,
}: ReorderableCardListProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      const newOrder = arrayMove(
        cards.map((card) => card.id),
        oldIndex,
        newIndex
      );
      onReorder?.(newOrder);
    }
  };
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No cards yet. Add some cards to get started!
      </div>
    );
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card, index) => (
          <SortableCard
            key={card.id}
            card={card}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
