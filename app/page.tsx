// app/page.tsx
import { LoginButton } from './components/auth/login-button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">42Recall</h1>
        <LoginButton />
      </div>
    </main>
  )
}