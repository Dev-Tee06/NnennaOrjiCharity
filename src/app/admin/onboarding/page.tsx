'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import { CheckCircle2, ShieldCheck, Copy, Check, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  role?: string;
  status?: string;
  onboarding_status?: string;
  full_name?: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  
  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // MFA Enrollment state
  const [factorId, setFactorId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [enrollingMfa, setEnrollingMfa] = useState(false);
  
  // Status state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState('');

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function initSession() {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.replace(/^#/, '');
      const hashParams = new URLSearchParams(hash);

      // 1. Check for explicit error parameters
      const errParam =
        urlParams.get('error') ||
        hashParams.get('error') ||
        urlParams.get('error_description') ||
        hashParams.get('error_description');

      if (errParam) {
        setLinkInvalid(true);
        setInvalidMsg(
          'This invitation link is invalid or has expired. Please ask your Super Admin to click "Resend Invite".'
        );
        setLoading(false);
        return;
      }

      // 2. Extract and establish session from hash fragment (#access_token=...&refresh_token=...)
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      if (accessToken && refreshToken) {
        try {
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!setSessionError && data?.session) {
            await handleSession(data.session);
            return;
          }
        } catch (e) {
          console.warn('Failed to set session from hash fragment:', e);
        }
      }

      // 3. PKCE code exchange in browser if ?code= exists
      const code = urlParams.get('code');
      if (code) {
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError && data?.session) {
            await handleSession(data.session);
            return;
          }
        } catch (e) {
          console.warn('Failed to exchange code for session:', e);
        }
      }

      // 4. Token hash OTP verification (?token_hash=...&type=invite)
      const tokenHash = urlParams.get('token_hash') || hashParams.get('token_hash');
      const otpType = (urlParams.get('type') || hashParams.get('type') || 'invite') as 'invite' | 'email' | 'recovery';
      if (tokenHash) {
        try {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType,
          });
          if (!verifyError && data?.session) {
            await handleSession(data.session);
            return;
          }
        } catch (e) {
          console.warn('Failed to verify OTP token hash:', e);
        }
      }

      // 5. Existing active session check
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleSession(session);
        return;
      }

      // 6. Auth listener fallback in case client library is still asynchronously parsing tokens
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, changedSession) => {
        if (changedSession) {
          await handleSession(changedSession);
          subscription.unsubscribe();
        }
      });

      // Bounded wait fallback if all previous extraction attempts yielded no session
      setTimeout(async () => {
        const { data: { session: fallbackSession } } = await supabase.auth.getSession();
        if (fallbackSession) {
          await handleSession(fallbackSession);
        } else {
          setLinkInvalid(true);
          setInvalidMsg(
            'No active invitation session found. Please open the link directly from your invitation email, or contact your Super Admin to resend your invite.'
          );
          setLoading(false);
        }
        subscription.unsubscribe();
      }, 1500);
    }

    async function handleSession(session: { user: User }) {
      setUser(session.user);
      
      // Fetch user profile from database
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || session.user.user_metadata?.full_name || '');

        // If already fully onboarded, redirect to login
        if (profileData.onboarding_status === 'Completed' && profileData.status === 'Active') {
          setStep(4);
          setLoading(false);
          return;
        }
      } else {
        setFullName(session.user.user_metadata?.full_name || '');
      }

      setLoading(false);
    }

    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 1 -> Step 2
  const handleConfirmProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    setStep(2);
  };

  // Step 2: Save Password -> Proceed to Step 3 (MFA setup)
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Update password and metadata in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { full_name: fullName.trim() }
      });

      if (updateError) throw updateError;

      // 2. Update full_name in profiles table (preserving role and status)
      if (user?.id) {
        await supabase.from('profiles').update({
          full_name: fullName.trim(),
        }).eq('id', user.id);
      }

      // 3. Initialize TOTP enrollment for Step 3
      await initializeMfaEnrollment();
      setStep(3);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Initialize TOTP Factor
  const initializeMfaEnrollment = async () => {
    setEnrollingMfa(true);
    setError('');
    try {
      // Clean up previous unverified attempts
      const factorsRes = await supabase.auth.mfa.listFactors();
      if (factorsRes.data?.all) {
        const unverified = factorsRes.data.all.filter(f => f.factor_type === 'totp' && f.status === 'unverified');
        for (const f of unverified) {
          try {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
          } catch {
            // Ignore cleanup error
          }
        }
      }

      const { data, error: enrollErr } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Admin Authenticator'
      });

      if (enrollErr) throw enrollErr;

      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setTotpSecret(data.totp.secret);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to initialize authenticator enrollment.');
    } finally {
      setEnrollingMfa(false);
    }
  };

  // Step 3: Verify TOTP Code & Complete Setup
  const handleVerifyMfaAndComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Active session not found. Please log in again.');
      return;
    }

    if (mfaCode.trim().length !== 6) {
      setError('Please enter a 6-digit numeric verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: mfaCode.trim()
      });

      if (verify.error) {
        throw new Error('The verification code is incorrect or has expired. Please check your authenticator app and try again.');
      }

      // Mark profile as active and completed
      const { error: profileUpdateError } = await supabase.from('profiles').update({
        onboarding_status: 'Completed',
        status: 'Active'
      }).eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      // Log successful onboarding
      await supabase.from('admin_activity_logs').insert({
        actor_id: user.id,
        action: 'ONBOARDING_COMPLETED',
        resource: user.id,
        details: { email: user.email }
      });

      // Advance to completion step
      setStep(4);
    } catch (err: unknown) {
      setError((err as Error).message || 'MFA verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2500);
  };

  if (loading && step === 1 && !linkInvalid) {
    return (
      <div className="min-h-screen bg-offWhite flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orangeRed1 mb-4"></div>
        <p className="text-sm font-semibold text-text-secondary">Validating invitation credentials...</p>
      </div>
    );
  }

  if (linkInvalid) {
    return (
      <div className="min-h-screen bg-offWhite flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px] bg-white py-10 px-6 sm:px-8 shadow-sm rounded-xl border border-border text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-blackKnight mb-2">Invitation Link Notice</h2>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            {invalidMsg || 'This invitation link could not be verified or has expired. If you need a new invitation, please contact your Super Admin.'}
          </p>
          <div className="space-y-3">
            <Link
              href="/admin/login"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 transition-colors"
            >
              Continue to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[480px] bg-white py-10 px-6 sm:px-8 shadow-sm rounded-xl border border-border">
        {/* Foundation Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-8 w-8 bg-orangeRed1 flex items-center justify-center rounded-[4px] font-bold text-white text-lg shrink-0">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl leading-tight text-blackKnight">NnennaOrjiCharity</span>
            <span className="text-[10px] text-text-secondary font-medium uppercase tracking-widest mt-[-2px]">
              Foundation
            </span>
          </div>
        </div>

        {/* Progress Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-heading font-bold text-blackKnight">Administrator Onboarding</h1>
          <p className="text-xs text-text-secondary mt-1">
            Step {step} of 4: {step === 1 && 'Confirm Identity'}
            {step === 2 && 'Create Secure Password'}
            {step === 3 && 'Set Up Authenticator App'}
            {step === 4 && 'Setup Completed'}
          </p>

          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-orangeRed1 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3.5 py-2.5 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Welcome & Profile Confirmation */}
        {step === 1 && (
          <form onSubmit={handleConfirmProfile} className="space-y-4">
            <div className="bg-orange-50/60 border border-orange-100 rounded-lg p-3.5 mb-2">
              <p className="text-xs text-orange-900 leading-relaxed">
                Welcome to the Nnenna Orji Charity Foundation management portal. You have been invited as an administrator.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-blackKnight mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blackKnight mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-text-secondary mt-1">This email is permanently linked to your invitation.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-blackKnight mb-1">Assigned Admin Role</label>
              <div className="inline-block px-3 py-1 bg-blackKnight text-white rounded-md text-xs font-bold">
                {profile?.role || 'Standard Admin'}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-1.5 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 transition-colors"
              >
                Continue to Password Setup <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Password Setup */}
        {step === 2 && (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="text-center mb-2">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 text-orangeRed1 mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-blackKnight">Create Your Account Password</h2>
              <p className="text-xs text-text-secondary">Password must contain at least 8 characters.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-blackKnight mb-1">Create Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blackKnight mb-1">Confirm Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/40"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving Password...' : 'Save Password & Continue'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Mandatory Authenticator QR Code Setup */}
        {step === 3 && (
          <form onSubmit={handleVerifyMfaAndComplete} className="space-y-4">
            <div className="text-center mb-2">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 text-orangeRed1 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-blackKnight">Connect Authenticator App</h2>
              <p className="text-xs text-text-secondary">
                Two-Factor Authentication is required for all administrative access.
              </p>
            </div>

            {enrollingMfa ? (
              <div className="py-8 text-center text-xs font-semibold text-text-secondary">
                Generating authenticator key...
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center bg-gray-50/70 p-4 rounded-xl border border-border">
                  <p className="text-xs font-bold text-blackKnight mb-2 text-center">
                    1. Scan with Google or Microsoft Authenticator
                  </p>
                  
                  <div className="bg-white p-3 border border-border rounded-lg shadow-sm mb-3">
                    {qrCode.startsWith('<svg') ? (
                      <div
                        className="w-40 h-40 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: qrCode }}
                      />
                    ) : (
                      <img src={qrCode} alt="TOTP QR Code" className="w-40 h-40 object-contain" />
                    )}
                  </div>

                  <div className="w-full text-center">
                    <p className="text-[11px] text-text-secondary mb-1">Cannot scan the code? Manual setup key:</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-mono text-[11px] bg-white border border-gray-300 px-2 py-1 rounded font-bold select-all break-all">
                        {totpSecret}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(totpSecret)}
                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                        title="Copy setup key"
                      >
                        {copiedSecret ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    {copiedSecret && (
                      <span className="text-[10px] text-green-600 font-semibold block mt-1">
                        Key copied to clipboard!
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blackKnight mb-1.5 text-center">
                    2. Enter the 6-Digit Code from Your Authenticator App
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="w-full max-w-[200px] mx-auto block rounded-md border border-gray-300 py-2.5 px-3 text-center text-xl tracking-widest font-mono focus:ring-orangeRed1 focus:border-orangeRed1 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || mfaCode.length < 6}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Verifying & Activating Account...' : 'Verify & Complete Setup'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* STEP 4: Completion */}
        {step === 4 && (
          <div className="text-center space-y-6 py-2">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-lg font-heading font-bold text-blackKnight">Setup Complete</h2>
              <p className="text-sm text-text-secondary mt-1">
                Your account has been set up successfully. You can now log in.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-left text-gray-700 space-y-2">
              <p className="font-semibold text-blackKnight">Account Details:</p>
              <p>• <strong>Name:</strong> {fullName}</p>
              <p>• <strong>Email:</strong> {user?.email}</p>
              <p>• <strong>Assigned Role:</strong> {profile?.role || 'Standard Admin'}</p>
              <p>• <strong>Security:</strong> Password & Authenticator App 2FA enabled</p>
            </div>

            <button
              onClick={() => router.push('/admin/login')}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 transition-colors"
            >
              Continue to Admin Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

