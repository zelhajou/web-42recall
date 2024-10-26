// app/auth/signin/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/lib/auth';
import { BookOpen, BrainCircuit, LineChart } from 'lucide-react';

import { LoginButton } from '@/components/auth/login-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Background and branding */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white dark:border-r lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          42Recall
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Master your learning journey with spaced repetition and active
              recall techniques."
            </p>
            <footer className="text-sm">42 Network</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Welcome to 42Recall
              </CardTitle>
              <CardDescription className="text-center">
                Sign in with your 42 account to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Features */}
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div className="text-sm text-muted-foreground">
                    Create and manage flashcard decks
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <div className="text-sm text-muted-foreground">
                    Learn using spaced repetition
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <LineChart className="h-5 w-5 text-primary" />
                  <div className="text-sm text-muted-foreground">
                    Track your learning progress
                  </div>
                </div>
              </div>

              {/* Login button */}
              <LoginButton />
            </CardContent>
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Built with ❤️ by 42 students
          </p>
        </div>
      </div>
    </div>
  );
}
