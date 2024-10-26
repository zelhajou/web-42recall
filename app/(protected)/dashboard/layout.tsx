import { DeckProvider } from '@/contexts/deck-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DeckProvider>
      {}
      {children}
    </DeckProvider>
  );
}
