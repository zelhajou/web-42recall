// app/(protected)/dashboard/decks/layout.tsx
import { Suspense } from 'react';

export default function DecksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}