import { LoginButton } from '@/components/auth/login-button';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to 42Recall</h1>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
