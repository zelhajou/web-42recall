// app/(protected)/dashboard/layout.tsx
import { DeckProvider } from '@/contexts/deck-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DeckProvider>
      {/* Your existing layout content */}
      {children}
    </DeckProvider>
  );
}