// app/(protected)/dashboard/create/page.tsx
import { FortyTwoDeckForm } from '@/components/decks/deck-form';

export default function CreateDeckPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Deck</h1>
      <FortyTwoDeckForm />
    </div>
  );
}