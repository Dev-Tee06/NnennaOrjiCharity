'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-offWhite flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="bg-white py-10 px-8 shadow-sm rounded-xl border border-border sm:w-full sm:max-w-[440px] text-center">
        
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <h2 className="text-xl font-heading font-bold text-blackKnight mb-4">Check Your Admin Email</h2>
        
        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          We've sent a password reset link to your email address:<br/>
          <span className="font-bold text-blackKnight">admin***@nocf.org</span>
        </p>

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-6">
          <p className="text-[11px] text-orange-800 leading-relaxed">
            If you don't see it, please check your spam folder.<br/>
            Link expires in 15 minutes.
          </p>
        </div>

        <button
          type="button"
          className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-blackKnight bg-white hover:bg-gray-50 focus:outline-none mb-4"
        >
          Resend Link (00:59)
        </button>
        
        <div className="text-center pt-2">
          <Link href="/admin/login" className="text-sm font-semibold text-orangeRed1 hover:text-orange-700">
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
