'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-offWhite flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="bg-white py-10 px-8 shadow-sm rounded-xl border border-border sm:w-full sm:max-w-[440px]">
        
        {/* Logo Area */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-8 w-8 bg-orangeRed1 flex items-center justify-center rounded-[4px] font-bold text-white text-lg shrink-0">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl leading-tight text-blackKnight">NnennaOrjiCharity</span>
            <span className="text-[10px] text-text-secondary font-medium uppercase tracking-widest mt-[-2px]">Foundation</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-heading font-bold text-blackKnight">NOCF Super Admin Portal</h2>
          <p className="text-sm text-text-secondary mt-1">Please enter your details to access the dashboard.</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-blackKnight mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@nocf.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm bg-gray-50/50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-blackKnight mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm bg-gray-50/50"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary cursor-pointer">
                Keep me logged in
              </label>
            </div>

            <div className="text-sm">
              <Link href="/admin/forgot-password" className="font-semibold text-orangeRed1 hover:text-orange-700">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1 disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Login to Dashboard'}
            </button>
          </div>
          
          <div className="text-center text-sm pt-4 border-t border-gray-100 mt-6">
            <span className="text-text-secondary">Don't have an account? </span>
            <Link
              href="/admin/register"
              className="font-semibold text-orangeRed1 hover:text-orange-700 ml-1"
            >
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
