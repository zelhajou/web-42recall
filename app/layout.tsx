// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from './components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}