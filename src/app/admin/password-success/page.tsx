'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function PasswordSuccessPage() {
  return (
    <div className="min-h-screen bg-offWhite flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="bg-white py-10 px-8 shadow-sm rounded-xl border border-border sm:w-full sm:max-w-[440px] text-center">
        
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <h2 className="text-xl font-heading font-bold text-blackKnight mb-4">Password Updated Successfully</h2>
        
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          Your admin password has been successfully updated. You can now login using your new credentials.
        </p>

        <Link href="/admin/login">
          <button
            type="button"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1"
          >
            Login with New Password
          </button>
        </Link>
        
      </div>
    </div>
  );
}
