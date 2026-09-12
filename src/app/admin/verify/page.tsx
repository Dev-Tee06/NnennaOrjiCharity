'use client';

import Link from 'next/link';

export default function VerifyIdentityPage() {
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
          <h2 className="text-xl font-heading font-bold text-blackKnight">Verify Your Identity</h2>
          <p className="text-sm text-text-secondary mt-2 px-2">Enter the 6-digit code sent to your email to confirm your login and keep your account secure.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.location.href = '/admin'; }}>
          
          <div>
            <label className="block text-sm font-semibold text-blackKnight mb-1.5">
              6-digit verification code
            </label>
            <input
              type="text"
              required
              placeholder="389 421"
              maxLength={7}
              className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm bg-gray-50/50 text-center tracking-widest font-bold"
            />
          </div>

          <p className="text-[11px] text-orangeRed1 font-medium flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-orangeRed1 mr-2 inline-block"></span>
            Please check your email address for the code.
          </p>

          <p className="text-sm text-text-secondary">
            Did not receive the code? <button type="button" className="text-orangeRed1 font-bold hover:underline">Resend (00:59)</button>
          </p>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1"
            >
              Verify & Continue
            </button>
          </div>
          
          <div className="flex items-center justify-between text-sm pt-2">
            <Link href="/admin/login" className="font-semibold text-blackKnight hover:text-gray-700">
              Back to login
            </Link>
            <Link href="/admin/login" className="font-semibold text-orangeRed1 hover:text-orange-700">
              Use a different email
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
