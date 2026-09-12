'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0 || !data.session) {
        setSuccess(true);
        setIsLoading(false);
      } else {
        router.push('/admin');
        router.refresh();
      }
    }
  };

  return (
    <div className="min-h-screen bg-offWhite flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
        <div className="relative h-12 w-[180px]">
          <Image
            src="/images/brand-logo.png"
            alt="NOCF Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-blackKnight font-body"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm font-body"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blackKnight font-body"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm font-body"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blackKnight font-body"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm font-body"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-body">{error}</div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-700 text-sm font-body rounded-md border border-green-200">
                Account created successfully! Please check your email to confirm your account before logging in.
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
            
            <div className="text-center text-sm pt-2">
              <span className="text-text-secondary font-body">Already have an account? </span>
              <Link
                href="/admin/login"
                className="font-medium text-orangeRed1 hover:text-orangeRed1/80 font-body"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
