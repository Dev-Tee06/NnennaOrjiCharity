'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      // If we just arrived with an invite link (implicit flow), the session might take a moment to be available.
      // But we always check getSession() to ensure we don't hang.
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            handleSession(session);
            subscription.unsubscribe();
          }
        });
      }

      // Check session directly (this also handles PKCE code exchange automatically in the browser)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Only redirect to login if we really have no session and no access_token in the URL that is still processing
        if (typeof window !== 'undefined' && !window.location.hash.includes('access_token')) {
          router.push('/admin/login');
        }
        return;
      }
      
      await handleSession(session);
    }

    async function handleSession(session: any) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      if (profile && profile.onboarding_status === 'Completed') {
        router.push('/admin'); // Already onboarded
        return;
      }

      setUser(session.user);
      setLoading(false);
    }

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    setStep(3); // Go to completion step
    setLoading(false);
  };

  const completeSetup = async () => {
    setLoading(true);
    try {
      // Mark profile as completed
      const { error } = await supabase.from('profiles').update({
        onboarding_status: 'Completed',
        status: 'Active'
      }).eq('id', user.id);

      if (error) throw error;

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to complete setup');
      setLoading(false);
    }
  };

  if (loading && step === 1) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Account Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {step} of 3
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Welcome to the Admin Portal</h3>
              <p className="text-sm text-gray-500 mb-6">
                You've been invited to manage the Nnenna & Orji Charity Foundation platform.
                Please confirm your email: <br/><strong>{user?.email}</strong>
              </p>
              <button
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none"
              >
                Continue to Password Setup
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSetPassword} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create your secure password</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none"
              >
                {loading ? 'Saving...' : 'Save Password & Continue'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Setup Complete</h3>
              <p className="text-sm text-gray-500">
                Your account has been secured and is ready to use. 
                In the future, you will receive a secure code via email when logging in.
              </p>
              <button
                onClick={completeSetup}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none"
              >
                {loading ? 'Activating...' : 'Go to Dashboard'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
