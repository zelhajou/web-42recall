'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Book,
  User,
  Edit,
  Trash2,
  Plus,
  Download,
  Share2,
  PlayCircle,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ReorderableCardList } from "./reorderable-card-list";
import {
  AddCardDialog,
  EditDeckDialog,
  DeleteConfirmDialog,
  ShareDeckDialog,
  EditCardDialog,
} from "@/components/dialogs";
import { Card as CardType, Deck } from "@/types/deck";
interface DeckDetailsProps {
  deck: Deck;
}
export function DeckDetails({ deck: initialDeck }: DeckDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deck, setDeck] = useState(initialDeck);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditDeckOpen, setIsEditDeckOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [deleteCardState, setDeleteCardState] = useState<{
    isOpen: boolean;
    card: CardType | null;
  }>({
    isOpen: false,
    card: null,
  });
  const refreshDeck = async () => {
    try {
      const response = await fetch(`/api/decks/${deck.id}`);
      if (!response.ok) throw new Error('Failed to fetch deck');
      const data = await response.json();
      const sortedCards = [...data.data.cards].sort((a, b) => a.order - b.order);
      setDeck({
        ...data.data,
        cards: sortedCards,
      });
    } catch (error) {
      console.error('Error refreshing deck:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to refresh deck data',
      });
    }
  };
  const handleDeleteDeck = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete deck");
      toast({
        title: "Success",
        description: "Deck deleted successfully.",
      });
      router.push("/dashboard/decks");
      router.refresh();
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete deck. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateDeck = async (updates: Partial<Deck>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update deck");
      const data = await response.json();
      setDeck(data.data);
      toast({
        title: "Success",
        description: "Deck updated successfully.",
      });
    } catch (error) {
      console.error("Error updating deck:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update deck. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
const handleUpdateCard = async (cardId: string, updates: Partial<CardType>) => {
  setIsLoading(true);
  try {
    setDeck(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.id === cardId 
          ? { ...card, ...updates } 
          : card
      ),
    }));
    const response = await fetch(`/api/decks/${deck.id}/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update card");
    toast({
      title: "Success",
      description: "Card updated successfully.",
    });
  } catch (error) {
    console.error("Error updating card:", error);
    await refreshDeck();
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update card. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};
const handleAddCards = async (cards: Omit<CardType, 'id' | 'deckId' | 'createdAt' | 'updatedAt' | 'order'>[]) => {
  setIsLoading(true);
  try {
    const response = await fetch(`/api/decks/${deck.id}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards }),
    });
    if (!response.ok) throw new Error("Failed to add cards");
    const data = await response.json();
    setDeck(prev => ({
      ...prev,
      cards: [...prev.cards, ...data.data],
      _count: {
        ...prev._count,
        cards: prev._count.cards + data.data.length
      }
    }));
    toast({
      title: "Success",
      description: `Added ${cards.length} cards successfully.`,
    });
    setIsAddCardOpen(false);
  } catch (error) {
    console.error("Error adding cards:", error);
    await refreshDeck();
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to add cards. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};
  const handleReorderCards = async (orderedIds: string[]) => {
    try {
      const reorderedCards = orderedIds
        .map(id => deck.cards.find(card => card.id === id))
        .filter((card): card is CardType => card !== undefined);
      setDeck(prev => ({
        ...prev,
        cards: reorderedCards
      }));
      const response = await fetch(`/api/decks/${deck.id}/cards/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!response.ok) throw new Error("Failed to reorder cards");
      await refreshDeck();
    } catch (error) {
      console.error("Error reordering cards:", error);
      await refreshDeck(); 
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder cards. Please try again.",
      });
    }
  };
  const deleteCard = async (cardId: string) => {
    setIsLoading(true);
    try {
      setDeck(prev => ({
        ...prev,
        cards: prev.cards.filter(c => c.id !== cardId),
        _count: {
          ...prev._count,
          cards: prev._count.cards - 1
        }
      }));
      const response = await fetch(`/api/decks/${deck.id}/cards/${cardId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete card");
      toast({
        title: "Success",
        description: "Card deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      await refreshDeck();
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete card. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setDeleteCardState({ isOpen: false, card: null });
    }
  };
  const exportDeck = () => {
    const deckData = {
      title: deck.title,
      description: deck.description,
      project: deck.project,
      topic: deck.topic,
      cards: deck.cards.map((card) => ({
        front: card.front,
        back: card.back,
        hint: card.hint,
        code: card.code,
      })),
    };
    const blob = new Blob([JSON.stringify(deckData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{deck.title}</h1>
          {deck.description && (
            <p className="text-muted-foreground">{deck.description}</p>
          )}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Created {new Date(deck.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>{deck._count.cards} cards</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{deck.user.name || "Anonymous"}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {deck.project && <Badge variant="secondary">{deck.project}</Badge>}
            {deck.topic && <Badge variant="outline">{deck.topic}</Badge>}
            {deck.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/dashboard/decks/${deck.id}/study`)}
            disabled={deck.cards.length === 0}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Study Now
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDeckOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Deck
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAddCardOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Cards
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Deck
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportDeck}>
                <Download className="h-4 w-4 mr-2" />
                Export Deck
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteOpen(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Deck
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {}
      <Card>
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-2xl font-bold">0%</p>
              <p className="text-sm text-muted-foreground">Mastery Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Cards Studied</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Study Sessions</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">Last Studied</p>
            </div>
          </div>
        </CardContent>
      </Card>
{}
<div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Cards</h2>
            <p className="text-sm text-muted-foreground">
              {deck._count.cards} cards in this deck
            </p>
          </div>
          <Button onClick={() => setIsAddCardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Cards
          </Button>
        </div>
        <ReorderableCardList
          cards={deck.cards}
          deckId={deck.id}
          onEdit={card => {
            setSelectedCard(card);
            setIsEditCardOpen(true);
          }}
          onDelete={card => setDeleteCardState({ isOpen: true, card })}
          onReorder={handleReorderCards}
          isLoading={isLoading}
        />
      </div>
      {}
      <AddCardDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        deckId={deck.id}
        onAddCards={handleAddCards}
      />
      <EditDeckDialog
        open={isEditDeckOpen}
        onOpenChange={setIsEditDeckOpen}
        deck={deck}
        onUpdate={handleUpdateDeck}
      />
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteDeck}
        title="Delete Deck"
        description="Are you sure you want to delete this deck? This action cannot be undone."
        isLoading={isLoading}
      />
      <ShareDeckDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        deck={deck}
      />
      {selectedCard && (
        <EditCardDialog
          open={isEditCardOpen}
          onOpenChange={(open) => {
            setIsEditCardOpen(open);
            if (!open) setSelectedCard(null);
          }}
          card={selectedCard}
          deckId={deck.id}
          onUpdate={handleUpdateCard}
        />
      )}
  <DeleteConfirmDialog
      open={deleteCardState.isOpen}
      onOpenChange={(open) =>
        !open && setDeleteCardState({ isOpen: false, card: null })
      }
      onConfirm={() =>
        deleteCardState.card && deleteCard(deleteCardState.card.id)
      }
      title="Delete Card"
      description="Are you sure you want to delete this card? This action cannot be undone."
      isLoading={isLoading}
    />
    </div>
  );
}
export default DeckDetails;
