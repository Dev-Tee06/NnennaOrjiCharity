'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Placeholder logic
    window.location.href = '/admin/check-email';
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
          <h2 className="text-xl font-heading font-bold text-blackKnight">Reset Admin Password</h2>
          <p className="text-sm text-text-secondary mt-2 px-2">Enter your registered Admin email below to receive a password reset link.</p>
        </div>

        <form className="space-y-5" onSubmit={handleReset}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-blackKnight mb-1.5">
              Admin Email / Email Address
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

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mt-4">
            <p className="text-[11px] text-orange-800 leading-relaxed">
              <span className="font-bold">Note:</span> You will receive an email containing a secure link to create a new password. Please check your inbox (and spam folder).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1 disabled:opacity-70"
            >
              Send Reset Instructions
            </button>
          </div>
          
          <div className="text-center pt-2">
            <Link href="/admin/login" className="text-sm font-semibold text-blackKnight hover:text-gray-700">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
