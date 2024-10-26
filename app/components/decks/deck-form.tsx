"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  X,
  Eye,
  EyeOff,
  Code2,
  Book,
  Users,
  Tags,
  ListPlus,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import Link from 'next/link';
const COMMON_42_PROJECTS = [
  "Libft",
  "ft_printf",
  "get_next_line",
  "Born2beroot",
  "FdF",
  "minitalk",
  "push_swap",
  "minishell",
  "philosophers",
  "NetPractice",
  "cub3d/miniRT",
  "CPP Modules",
  "inception",
  "ft_irc",
  "ft_transcendence",
] as const;
const TOPICS = [
  "C Functions",
  "System Calls",
  "Data Structures",
  "Algorithms",
  "Shell Commands",
  "Networking",
  "Memory Management",
  "Process Management",
  "Docker",
  "Git Commands",
  "Project Tips",
  "Common Errors",
] as const;
interface Card {
  front: string;
  back: string;
  hint?: string;
  code?: string;
}
export function FortyTwoDeckForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    topic: "",
    isPublic: true,
    cards: [] as Card[],
  });
  const [currentCard, setCurrentCard] = useState<Card>({
    front: "",
    back: "",
    hint: "",
    code: "",
  });
  const addCard = () => {
    if (currentCard.front && currentCard.back) {
      setFormData((prev) => ({
        ...prev,
        cards: [...prev.cards, currentCard],
      }));
      setCurrentCard({ front: "", back: "", hint: "", code: "" });
    }
  };
  const removeCard = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (formData.cards.length === 0) {
        throw new Error("Add at least one card to create a deck");
      }
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          project: formData.project || null,
          topic: formData.topic || null,
          isPublic: formData.isPublic,
          cards: formData.cards.map((card) => ({
            front: card.front.trim(),
            back: card.back.trim(),
            hint: card.hint?.trim() || null,
            code: card.code?.trim() || null,
          })),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create deck");
      }
      const { data } = await response.json();
      toast({
        title: "Success",
        description: "Deck created successfully!",
      });
      router.push(`/dashboard/decks/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating deck:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create deck",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const renderPreview = () => (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deck Preview</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      {showPreview && (
        <CardContent>
          <div className="space-y-6">
            {}
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-bold">
                  {formData.title || "Untitled Deck"}
                </h2>
                {formData.description && (
                  <p className="text-muted-foreground">
                    {formData.description}
                  </p>
                )}
              </div>
              {}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  {formData.cards.length} cards
                </div>
                {formData.project && (
                  <div className="flex items-center gap-1">
                    <Code2 className="w-4 h-4" />
                    {formData.project}
                  </div>
                )}
                {formData.topic && (
                  <div className="flex items-center gap-1">
                    <Tags className="w-4 h-4" />
                    {formData.topic}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formData.isPublic ? "Public" : "Private"}
                </div>
              </div>
              {}
              <div className="flex flex-wrap gap-2">
                {formData.project && (
                  <Badge variant="secondary">{formData.project}</Badge>
                )}
                {formData.topic && (
                  <Badge variant="outline">{formData.topic}</Badge>
                )}
              </div>
            </div>
            {}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cards</h3>
              {formData.cards.length > 0 ? (
                <div className="grid gap-4">
                  {formData.cards.map((card, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-medium">
                                Question {index + 1}
                              </p>
                              <p>{card.front}</p>
                            </div>
                            <Badge variant="outline">Front</Badge>
                          </div>
                        </div>
                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-medium">Answer</p>
                              <p>{card.back}</p>
                            </div>
                            <Badge variant="outline">Back</Badge>
                          </div>
                        </div>
                        {(card.hint || card.code) && (
                          <div className="space-y-2 pt-4 border-t">
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
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg bg-muted/50">
                  <ListPlus className="w-8 h-8 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No cards added yet. Start adding cards to preview your deck.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild className="hover:bg-muted">
          <Link href="/dashboard/decks">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Link>
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Deck Title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            value={formData.project}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, project: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_42_PROJECTS.map((project) => (
                <SelectItem key={project} value={project.toLowerCase()}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={formData.topic}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, topic: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic.toLowerCase()}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Deck Description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isPublic}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isPublic: checked }))
            }
          />
          <label>Share with other 42 students</label>
        </div>
        {}
        <Card>
          <CardHeader>
            <CardTitle>Add New Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Question (e.g., What does malloc return on error?)"
              value={currentCard.front}
              onChange={(e) =>
                setCurrentCard((prev) => ({ ...prev, front: e.target.value }))
              }
            />
            <Textarea
              placeholder="Answer"
              value={currentCard.back}
              onChange={(e) =>
                setCurrentCard((prev) => ({ ...prev, back: e.target.value }))
              }
            />
            <Input
              placeholder="Hint (e.g., Think about null pointer)"
              value={currentCard.hint || ""}
              onChange={(e) =>
                setCurrentCard((prev) => ({ ...prev, hint: e.target.value }))
              }
            />
            <Textarea
              placeholder="Code Example (optional)"
              className="font-mono text-sm"
              value={currentCard.code || ""}
              onChange={(e) =>
                setCurrentCard((prev) => ({ ...prev, code: e.target.value }))
              }
            />
            <Button
              type="button"
              onClick={addCard}
              disabled={!currentCard.front || !currentCard.back}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </CardContent>
        </Card>
        {}
        {formData.cards.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Cards ({formData.cards.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
            <div className="space-y-2">
              {formData.cards.map((card, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="font-medium">{card.front}</p>
                      <p className="text-sm text-muted-foreground">
                        {card.back}
                      </p>
                      {card.hint && (
                        <p className="text-sm text-muted-foreground italic">
                          Hint: {card.hint}
                        </p>
                      )}
                      {card.code && (
                        <pre className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto">
                          {card.code}
                        </pre>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCard(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading || formData.cards.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Deck"
            )}
          </Button>
        </div>
      </form>
      {formData.cards.length === 0 && (
        <Alert>
          <AlertDescription>
            Start by adding cards about{" "}
            {formData.project || "your chosen project"}. Include code examples
            and common pitfalls to help fellow 42 students!
          </AlertDescription>
        </Alert>
      )}
      {}
      {renderPreview()}
    </div>
  );
}
export default FortyTwoDeckForm;
