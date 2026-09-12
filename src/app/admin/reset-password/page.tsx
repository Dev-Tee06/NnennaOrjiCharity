'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function CreatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          <h2 className="text-xl font-heading font-bold text-blackKnight">Create a New Admin Password</h2>
          <p className="text-sm text-text-secondary mt-2 px-2">Create your new, strong password below. It must be at least 8 characters long.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.location.href = '/admin/password-success'; }}>
          
          <div>
            <label className="block text-sm font-semibold text-blackKnight mb-1.5">
              New Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••••"
                className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm bg-gray-50/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blackKnight mb-1.5">
              Confirm New Admin Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="••••••••••••••"
                className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm bg-gray-50/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h4 className="text-xs font-semibold text-blackKnight mb-2">Password must contain:</h4>
            <ul className="space-y-1.5">
              <li className="flex items-center text-xs text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Minimum 8 characters
              </li>
              <li className="flex items-center text-xs text-gray-500">
                <div className="h-3.5 w-3.5 border border-gray-300 rounded-full mr-2"></div> At least one uppercase letter
              </li>
              <li className="flex items-center text-xs text-gray-500">
                <div className="h-3.5 w-3.5 border border-gray-300 rounded-full mr-2"></div> At least one special character (!@#$)
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
            <p className="text-[11px] text-orange-800 leading-relaxed">
              <span className="font-bold">Note:</span> You will be asked to log in again with this new password after saving.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1"
            >
              Save Password
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
