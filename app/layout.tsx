// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from './components/providers/auth-provider'
import { ToastProvider } from '@/components/providers/toast-provider';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '42Recall',
  description: 'Flashcard app for 42 students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}