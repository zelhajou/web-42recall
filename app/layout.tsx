import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

import AuthProvider from './components/providers/auth-provider';
import './globals.css';

import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });
export const metadata = {
  title: '42Recall',
  description: 'Flashcard app for 42 students',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          <AuthProvider>{children}</AuthProvider>
          <ToastProvider />
        </ThemeProvider>
        <Analytics/>
      </body>
    </html>
  );
}
