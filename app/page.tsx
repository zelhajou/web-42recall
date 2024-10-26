import { LoginButton } from './components/auth/login-button';
import { Button } from "@/components/ui/button";
import { Brain, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex items-center justify-center p-4">
      <div className="max-w-5xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Text Section */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Master 42 with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              42Recall
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Elevate your coding skills using our advanced spaced repetition system tailored for 42 School students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <LoginButton />
          </div>
        </div>

        {/* Features Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative bg-gray-800 rounded-2xl p-6 shadow-2xl transition-transform transform hover:scale-105">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, title: "Optimized Learning", description: "Scientifically proven spaced repetition" },
                { icon: Zap, title: "Quick Recall", description: "Boost your coding memory retention" },
                { icon: Users, title: "Peer Learning", description: "Share and collaborate on flashcard decks" },
                { icon: Users, title: "42 Focused", description: "Content tailored for 42 School curriculum" },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 bg-gray-700 rounded-lg transition-transform transform hover:scale-105">
                  <feature.icon className="w-12 h-12 text-blue-400 mb-2 transition-colors hover:text-blue-300" />
                  <h3 className="font-semibold mb-1 text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
