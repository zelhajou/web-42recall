'use client';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

import { Button } from '../ui/button';

export function AuthComponent() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Welcome, {session.user?.name}</p>
        <Button onClick={() => signOut()} variant="outline">
          Sign out
        </Button>
      </div>
    );
  }
  return <Button onClick={() => signIn('42-school')}>Sign in with 42</Button>;
}
