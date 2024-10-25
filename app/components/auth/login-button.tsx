// app/components/auth/login-button.tsx
'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const result = await signIn('42-school', {
        callbackUrl: '/dashboard',
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className="w-full"
      size="lg"
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        'Sign in with 42'
      )}
    </Button>
  )
}