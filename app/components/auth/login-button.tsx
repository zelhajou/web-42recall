'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
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
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }
  return (
    <Button 
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg transition-all duration-300" 
      size="lg"
      onClick={handleLogin}
      disabled={isLoading}
      aria-label="Sign in with 42"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Image 
            src="/images/logo.svg" 
            alt="42 Logo" 
            width={24} 
            height={24} 
            className="h-6 w-6"
          />
          Sign in with 42
        </>
      )}
    </Button>
  )
}
