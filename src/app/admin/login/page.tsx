'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ShieldCheck, Copy, Check, ArrowLeft, AlertCircle } from 'lucide-react';

type LoginState = 'CREDENTIALS' | 'MFA_VERIFY' | 'MFA_ENROLL' | 'EMAIL_OTP';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('CREDENTIALS');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // MFA Verification State
  const [mfaCode, setMfaCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [hasEmailOtpFallback, setHasEmailOtpFallback] = useState(false);
  const [activeUserId, setActiveUserId] = useState('');

  // MFA Enrollment State
  const [qrCode, setQrCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error('Authentication failed. Please check your credentials.');
      }

      setActiveUserId(data.user.id);

      // Check user account status in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status, onboarding_status')
        .eq('id', data.user.id)
        .single();

      if (profile && (profile.status === 'Suspended' || profile.status === 'Revoked')) {
        await supabase.auth.signOut();
        throw new Error('Your administrator account has been suspended or revoked. Please contact a Super Admin.');
      }

      // Inspect MFA factors and assurance level
      const [assuranceRes, factorsRes] = await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ]);

      const verifiedFactors = factorsRes.data?.all?.filter(
        (f) => f.factor_type === 'totp' && f.status === 'verified'
      ) || [];

      if (verifiedFactors.length > 0) {
        // State B: User has a verified authenticator enrolled
        const targetFactor = verifiedFactors[0];
        setFactorId(targetFactor.id);
        setHasEmailOtpFallback(true);

        if (assuranceRes.data?.nextLevel === 'aal2') {
          setLoginState('MFA_VERIFY');
          setMfaCode('');
          setIsLoading(false);
          return;
        }

        // Already at required assurance level
        await handleSuccessfulLogin(data.user.id, profile);
      } else {
        // If user onboarding is pending, redirect them to onboarding
        if (profile?.onboarding_status === 'Pending Setup') {
          router.push('/admin/onboarding');
          return;
        }

        // State C: Authenticator setup required for administrators without 2FA
        await startLoginEnrollment();
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  const startLoginEnrollment = async () => {
    try {
      // Clean up any unverified factor from previous attempts
      const factorsRes = await supabase.auth.mfa.listFactors();
      if (factorsRes.data?.all) {
        const unverified = factorsRes.data.all.filter((f) => f.factor_type === 'totp' && f.status === 'unverified');
        for (const f of unverified) {
          try {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
          } catch {
            // ignore cleanup errors
          }
        }
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Admin Authenticator',
      });

      if (enrollError) throw enrollError;

      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setTotpSecret(data.totp.secret);
        setMfaCode('');
        setLoginState('MFA_ENROLL');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Could not initialize authenticator setup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.trim().length !== 6) {
      setError('Please enter a complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        if (challenge.error.message.toLowerCase().includes('expired')) {
          throw new Error('Verification challenge expired. Please try again.');
        }
        throw challenge.error;
      }

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: mfaCode.trim(),
      });

      if (verify.error) {
        throw new Error('The verification code is incorrect or has expired. Please try again.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await handleSuccessfulLogin(user.id);
      } else {
        router.push('/admin');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Verification failed.');
      setIsLoading(false);
    }
  };

  const handleCompleteEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.trim().length !== 6) {
      setError('Please enter a complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: mfaCode.trim(),
      });

      if (verify.error) {
        throw new Error('The verification code is incorrect or has expired. Please check your authenticator app and try again.');
      }

      setSuccessMsg('Authenticator app successfully configured.');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTimeout(async () => {
          await handleSuccessfulLogin(user.id);
        }, 1200);
      } else {
        router.push('/admin');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Enrollment verification failed.');
      setIsLoading(false);
    }
  };

  const switchToEmailOtp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await supabase.auth.signOut();
      const otpRes = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });

      if (otpRes.error) throw otpRes.error;

      setLoginState('EMAIL_OTP');
      setMfaCode('');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to dispatch email verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: otpError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: mfaCode.trim(),
        type: 'email',
      });

      if (otpError) throw otpError;

      if (data.user) {
        await handleSuccessfulLogin(data.user.id);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid or expired email verification code.');
      setIsLoading(false);
    }
  };

  const handleRequestNewQrCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/mfa/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'self_reset', userId: activeUserId }),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to prepare new QR code.');
      }
      // Old factor cleared on backend, start fresh enrollment and display QR code
      await startLoginEnrollment();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to prepare new QR code.');
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async (
    userId: string,
    existingProfile?: { onboarding_status?: string } | null
  ) => {
    let profile: { onboarding_status?: string } | null = existingProfile ?? null;
    if (!profile) {
      const { data } = await supabase.from('profiles').select('onboarding_status').eq('id', userId).single();
      profile = data;
    }

    if (profile?.onboarding_status !== 'Completed') {
      router.push('/admin/onboarding');
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2500);
  };

  const resetToCredentials = () => {
    setLoginState('CREDENTIALS');
    setMfaCode('');
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="min-h-screen bg-offWhite flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[460px] bg-white py-10 px-6 sm:px-8 shadow-sm rounded-xl border border-border">
        {/* Logo Area */}
        <div className="flex items-center justify-center gap-2 mb-8">
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

        {/* STATE A: Email & Password */}
        {loginState === 'CREDENTIALS' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-heading font-bold text-blackKnight">
                Admin Portal Login
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Please enter your credentials to access the administrative dashboard.
              </p>
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
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
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
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1 disabled:opacity-70 transition-colors"
                >
                  {isLoading ? 'Signing In...' : 'Login to Dashboard'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* STATE B: MFA Verification Required */}
        {loginState === 'MFA_VERIFY' && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-3 text-orangeRed1">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-heading font-bold text-blackKnight">
                Authenticator Verification Required
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Enter the current 6-digit code generated by your Authenticator app.
              </p>
            </div>

            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  autoFocus
                  className="appearance-none block w-full px-3.5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 text-center text-2xl tracking-widest font-mono bg-gray-50/50"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || mfaCode.length < 6}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify Code & Sign In'}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-gray-100 space-y-2">
              <button
                type="button"
                onClick={handleRequestNewQrCode}
                disabled={isLoading}
                className="text-xs sm:text-sm font-bold text-orangeRed1 hover:text-orange-700 block mx-auto px-2 py-1 text-center leading-relaxed transition-colors"
              >
                Don&apos;t have an authenticator app paired? Scan a new QR code
              </button>
              {hasEmailOtpFallback && (
                <button
                  type="button"
                  onClick={switchToEmailOtp}
                  disabled={isLoading}
                  className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-blackKnight block mx-auto px-2"
                >
                  Send code via Email OTP instead
                </button>
              )}
              <button
                type="button"
                onClick={resetToCredentials}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto pt-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to email & password
              </button>
            </div>
          </div>
        )}

        {/* STATE C: MFA Enrollment Required (QR Code Setup) */}
        {loginState === 'MFA_ENROLL' && (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-2 text-orangeRed1">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-base sm:text-lg font-heading font-bold text-blackKnight">
                Set Up Authenticator App
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 px-2 leading-relaxed">
                Two-Factor Authentication is required for all administrative accounts.
              </p>
            </div>

            {successMsg ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg text-center font-semibold">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleCompleteEnrollment} className="space-y-4">
                {/* Step 1: Scan QR Code */}
                <div>
                  <p className="text-xs font-bold text-blackKnight mb-2">Step 1: Scan this QR code</p>
                  <p className="text-xs text-text-secondary mb-3">
                    Scan with Google Authenticator, Microsoft Authenticator, or another compatible TOTP app:
                  </p>

                  <div className="flex flex-col items-center bg-gray-50/70 p-4 rounded-xl border border-border">
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
                      <p className="text-[11px] text-text-secondary mb-1">Cannot scan? Enter code manually:</p>
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
                          Setup key copied to clipboard!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2: Enter Verification Code */}
                <div>
                  <p className="text-xs font-bold text-blackKnight mb-1.5">
                    Step 2: Enter the 6-digit verification code
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 text-center text-xl tracking-widest font-mono bg-white"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg text-center font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || mfaCode.length < 6}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Complete Enrollment'}
                </button>
              </form>
            )}

            <div className="pt-2 text-center border-t border-gray-100">
              <button
                type="button"
                onClick={resetToCredentials}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </button>
            </div>
          </div>
        )}

        {/* Alternate Fallback: EMAIL OTP */}
        {loginState === 'EMAIL_OTP' && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-lg font-heading font-bold text-blackKnight">
                Email Verification Required
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Enter the secure code sent to <strong>{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  placeholder="000000"
                  className="appearance-none block w-full px-3.5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orangeRed1 focus:border-orangeRed1 text-center text-xl tracking-widest bg-gray-50/50"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orangeRed1 disabled:opacity-70 transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-gray-100">
              <button
                type="button"
                onClick={resetToCredentials}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

