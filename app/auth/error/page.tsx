'use client'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in using the correct provider.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to access this resource.'
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.'
      default:
        return 'An error occurred during authentication. Please try again.'
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="text-gray-600">{getErrorMessage(error)}</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
