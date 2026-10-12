'use client';

import { Search, Bell, ChevronDown, UploadCloud, CheckCircle2, AlertTriangle, Monitor, Smartphone, Check, Copy, ShieldCheck, Key, X, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const supabase = createClient();

  // Foundation Settings State
  const [foundation, setFoundation] = useState<any>({ contact_email: '', support_phone: '', hq_address: '' });
  const [savingFoundation, setSavingFoundation] = useState(false);

  // Email Templates State
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  const [showPasswordAal2Prompt, setShowPasswordAal2Prompt] = useState(false);
  const [passwordAal2Code, setPasswordAal2Code] = useState('');

  // 2FA State
  const [mfaStatus, setMfaStatus] = useState<any>(null);
  const [verifiedFactor, setVerifiedFactor] = useState<any>(null);
  const [unverifiedFactor, setUnverifiedFactor] = useState<any>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [factorId, setFactorId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Re-authentication / replace factor state
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthCode, setReauthCode] = useState('');
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [reauthError, setReauthError] = useState('');

  const [toast, setToast] = useState<{show: boolean, msg: string, type: 'success'|'error'}>({show: false, msg: '', type: 'success'});

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    fetchSettings();
    fetchTemplates();
    checkMfa();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('foundation_settings').select('*').limit(1).single();
    if (data) setFoundation(data);
  };

  const fetchTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*').order('category');
    if (data) {
      setTemplates(data);
      if (data.length > 0) setActiveTemplateId(data[0].id);
    }
  };

  const checkMfa = async () => {
    try {
      const [assuranceRes, factorsRes] = await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors()
      ]);

      if (assuranceRes.data) setMfaStatus(assuranceRes.data);

      const all = factorsRes.data?.all || [];
      const verified = all.find(f => f.factor_type === 'totp' && f.status === 'verified');
      const unverified = all.find(f => f.factor_type === 'totp' && f.status === 'unverified');

      setVerifiedFactor(verified || null);
      setUnverifiedFactor(unverified || null);
    } catch (err: any) {
      console.error('Error checking MFA status:', err);
    }
  };

  const saveFoundation = async () => {
    setSavingFoundation(true);
    await supabase.from('foundation_settings').update({
      contact_email: foundation.contact_email,
      support_phone: foundation.support_phone,
      hq_address: foundation.hq_address,
      updated_at: new Date()
    }).eq('id', foundation.id);
    setSavingFoundation(false);
    showToast('Foundation settings updated successfully!');
  };

  const saveTemplate = async () => {
    if (!activeTemplateId) return;
    setSavingTemplate(true);
    const activeTpl = templates.find(t => t.id === activeTemplateId);
    if (activeTpl) {
      await supabase.from('email_templates').update({
        subject: activeTpl.subject,
        body: activeTpl.body,
        updated_at: new Date()
      }).eq('id', activeTemplateId);
      showToast('Template saved successfully!');
    }
    setSavingTemplate(false);
  };

  const handleTemplateChange = (field: string, value: string) => {
    setTemplates(templates.map(t => t.id === activeTemplateId ? { ...t, [field]: value } : t));
  };

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || null;

  const updatePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setPasswordMsg('Password must be at least 8 characters');
      return;
    }

    const mfaStatusData = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (mfaStatusData.data?.currentLevel === 'aal1' && mfaStatusData.data?.nextLevel === 'aal2') {
      setShowPasswordAal2Prompt(true);
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg('');
      showToast('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setShowPasswordAal2Prompt(false);
      setPasswordAal2Code('');
    }
  };

  const verifyAal2ForPassword = async () => {
    setSavingPassword(true);
    setPasswordMsg('');
    const factors = await supabase.auth.mfa.listFactors();
    const totpFactor = factors.data?.totp?.[0] || factors.data?.all.find(f => f.factor_type === 'totp');
    
    if (!totpFactor) {
      setPasswordMsg("Authenticator setup not found.");
      setSavingPassword(false);
      return;
    }

    const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
    if (challenge.error) {
       setPasswordMsg(challenge.error.message);
       setSavingPassword(false);
       return;
    }

    const verify = await supabase.auth.mfa.verify({
       factorId: totpFactor.id,
       challengeId: challenge.data.id,
       code: passwordAal2Code
    });

    if (verify.error) {
       setPasswordMsg(verify.error.message);
       setSavingPassword(false);
    } else {
       const { error } = await supabase.auth.updateUser({ password });
       setSavingPassword(false);
       if (error) {
         setPasswordMsg(error.message);
       } else {
         setPasswordMsg('');
         showToast('Password updated successfully!');
         setPassword('');
         setConfirmPassword('');
         setShowPasswordAal2Prompt(false);
         setPasswordAal2Code('');
         checkMfa();
       }
    }
  };

  const enrollNewTotpFactor = async () => {
    setEnrolling(true);
    setMfaError('');
    setMfaCode('');

    try {
      // Clean up any unverified factors from previous abandoned attempts
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.data?.all) {
        const unverified = factors.data.all.filter(f => f.factor_type === 'totp' && f.status === 'unverified');
        for (const f of unverified) {
          try {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
          } catch (e) {
            // Ignore unenroll errors on unverified factors
          }
        }
      }

      const { data, error } = await supabase.auth.mfa.enroll({ 
        factorType: 'totp',
        friendlyName: 'Admin Authenticator'
      });

      if (error) {
        const friendlyMsg = error.message.includes('AAL2')
          ? 'Please verify your current authenticator code before making security changes.'
          : (error.message || 'We could not set up your authenticator app. Please try again.');
        setMfaError(friendlyMsg);
        return;
      }

      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setTotpSecret(data.totp.secret);
      }
    } catch (err: any) {
      setMfaError(err.message || 'Failed to start authenticator setup. Please try again.');
    }
  };

  const startMfaEnrollment = async () => {
    if (verifiedFactor) {
      // An existing factor is already enrolled. Enrolling a new one or replacing requires AAL2.
      // If we are at AAL2 already, proceed. Otherwise prompt for re-auth code.
      if (mfaStatus?.currentLevel === 'aal2') {
        try {
          await supabase.auth.mfa.unenroll({ factorId: verifiedFactor.id });
          await enrollNewTotpFactor();
        } catch (err: any) {
          setMfaError(err.message);
        }
      } else {
        setReauthError('');
        setReauthCode('');
        setShowReauthModal(true);
      }
    } else {
      await enrollNewTotpFactor();
    }
  };

  const handleReauthAndReplace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verifiedFactor) return;
    if (reauthCode.trim().length !== 6) {
      setReauthError('Please enter a 6-digit verification code.');
      return;
    }

    setIsReauthenticating(true);
    setReauthError('');

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: verifiedFactor.id });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId: verifiedFactor.id,
        challengeId: challenge.data.id,
        code: reauthCode.trim()
      });

      if (verify.error) {
        throw new Error('The verification code is incorrect or has expired. Please try again.');
      }

      // Session is now elevated to AAL2! Safely unenroll existing factor.
      const unenrollRes = await supabase.auth.mfa.unenroll({ factorId: verifiedFactor.id });
      if (unenrollRes.error) throw unenrollRes.error;

      setShowReauthModal(false);
      setReauthCode('');
      await checkMfa();
      await enrollNewTotpFactor();
    } catch (err: any) {
      setReauthError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsReauthenticating(false);
    }
  };

  const verifyMfa = async () => {
    if (mfaCode.trim().length !== 6) {
      setMfaError('Please enter a 6-digit numeric verification code.');
      return;
    }

    setIsVerifyingMfa(true);
    setMfaError('');

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        if (challenge.error.message.toLowerCase().includes('expired')) {
          throw new Error('Your verification session has expired. Start verification again.');
        }
        throw challenge.error;
      }
      
      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: mfaCode.trim()
      });
      
      if (verify.error) {
        throw new Error('The verification code is incorrect or has expired. Please try again.');
      }

      setEnrolling(false);
      setFactorId('');
      setQrCode('');
      setTotpSecret('');
      setMfaCode('');
      await checkMfa();
      showToast('Authenticator app successfully configured.');
    } catch (err: unknown) {
      setMfaError((err as Error).message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifyingMfa(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2500);
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      showToast('File size exceeds the 1.5MB limit.', 'error');
      return;
    }
    showToast('File selected successfully.');
  };

  const has2FA = !!verifiedFactor;

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`absolute top-4 right-4 z-50 px-4 py-3 rounded shadow-lg font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <TopHeader title="System Settings" />
      <MobilePageTitle title="System Settings" />

      <div className="flex-1 overflow-y-auto p-4 md:p-4">
        
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-border mb-8 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-blackKnight'}`}
          >
            General Operations
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'email' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-blackKnight'}`}
          >
            Email Command Templates
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'security' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-blackKnight'}`}
          >
            Security & Password Setup
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="bg-white border border-border rounded-xl shadow-sm p-8 max-w-3xl">
            <h3 className="text-lg font-heading font-bold text-blackKnight mb-6 pb-4 border-b border-border">Foundation General Information</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-blackKnight mb-2">Primary Foundation Contact Email</label>
                <input
                  type="email"
                  value={foundation.contact_email || ''}
                  onChange={(e) => setFoundation({...foundation, contact_email: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blackKnight mb-2">Primary Support Phone Number</label>
                <input
                  type="text"
                  value={foundation.support_phone || ''}
                  onChange={(e) => setFoundation({...foundation, support_phone: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                />
                <p className="text-xs text-text-secondary mt-2">This is the number donors will see and call when they want to inquire about logistics.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-blackKnight mb-2">Primary HQ / Foundation Address</label>
                <textarea
                  rows={3}
                  value={foundation.hq_address || ''}
                  onChange={(e) => setFoundation({...foundation, hq_address: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={saveFoundation} disabled={savingFoundation} className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                  {savingFoundation ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 space-y-3">
              <h3 className="text-sm font-bold text-blackKnight mb-4 pl-2">Automated System Prompts</h3>
              
              {templates.map(t => (
                <div 
                  key={t.id}
                  onClick={() => setActiveTemplateId(t.id)}
                  className={`${activeTemplateId === t.id ? 'bg-white border-l-4 border-orangeRed1 rounded-r-lg shadow-sm' : 'bg-transparent border-l-4 border-transparent hover:bg-white hover:border-gray-200 rounded-lg'} p-4 cursor-pointer transition-colors`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${activeTemplateId === t.id ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className={`text-sm font-bold ${activeTemplateId === t.id ? 'text-blackKnight' : 'text-gray-700'}`}>{t.category}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-2/3 bg-white border border-border rounded-xl shadow-sm p-8">
              {activeTemplate ? (
                <>
                  <h3 className="text-lg font-heading font-bold text-blackKnight mb-1">Edit automated Template: {activeTemplate.category}</h3>
                  <p className="text-xs text-text-secondary mb-6 pb-4 border-b border-border">This goes out to the primary donor's email address upon form submission.</p>

                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-blackKnight mb-2">Subject / Headline Title</label>
                      <input
                        type="text"
                        value={activeTemplate.subject || ''}
                        onChange={(e) => handleTemplateChange('subject', e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blackKnight mb-2">Message / Email Body Context (HTML Supported)</label>
                      <textarea
                        rows={8}
                        value={activeTemplate.body || ''}
                        onChange={(e) => handleTemplateChange('body', e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-blackKnight mb-2">Attachments</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors">
                          <input type="file" className="hidden" onChange={handleFileUpload} />
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <UploadCloud className="h-5 w-5 text-gray-500" />
                          </div>
                          <span className="text-sm font-bold text-orangeRed1">Upload Files</span>
                          <span className="text-xs text-gray-400 mt-1">Max file size limit is 1.5MB</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blackKnight mb-2">Available Dynamic Short Codes</label>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Donor_Name]</span>
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Pledge_Quantity]</span>
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Pledge_Category]</span>
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Tracking_Number]</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <button type="button" className="text-sm font-bold text-text-secondary hover:text-blackKnight transition-colors underline">
                        Reset Template to Default
                      </button>
                      <button type="button" onClick={saveTemplate} disabled={savingTemplate} className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                        {savingTemplate ? 'Saving...' : 'Save Email Template'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 text-sm">Select a template to edit</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-border rounded-xl shadow-sm p-8">
              <h3 className="text-lg font-heading font-bold text-blackKnight mb-6 pb-4 border-b border-border">Update Admin's Password</h3>
              <form onSubmit={updatePassword} className="space-y-6">
                {passwordMsg && (
                  <div className={`p-3 rounded text-sm ${passwordMsg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {passwordMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="block w-full max-w-md rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="block w-full max-w-md rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 max-w-md">
                  <h4 className="text-xs font-semibold text-blackKnight mb-2">Password must contain:</h4>
                  <ul className="space-y-1.5">
                    <li className="flex items-center text-xs text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Minimum 8 characters
                    </li>
                  </ul>
                </div>

                {!showPasswordAal2Prompt ? (
                  <div className="pt-2">
                    <button type="submit" disabled={savingPassword} className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                      {savingPassword ? 'Updating...' : 'Update Security Settings'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-orange-800 mb-2">Authenticator Required</h4>
                    <p className="text-xs text-orange-700 mb-3">To complete this security update, please enter the 6-digit code from your Authenticator app.</p>
                    <input 
                      type="text" 
                      value={passwordAal2Code} 
                      onChange={e => setPasswordAal2Code(e.target.value.replace(/[^0-9]/g, ''))} 
                      placeholder="000000" 
                      maxLength={6}
                      className="block w-full max-w-[200px] rounded-md border border-orange-300 py-2 px-3 text-sm focus:ring-orangeRed1 mb-3 bg-white"
                    />
                    <div className="flex gap-3">
                      <button type="button" onClick={verifyAal2ForPassword} disabled={savingPassword || passwordAal2Code.length < 6} className="bg-orangeRed1 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors disabled:opacity-50">
                        {savingPassword ? 'Verifying...' : 'Verify & Update'}
                      </button>
                      <button type="button" onClick={() => setShowPasswordAal2Prompt(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-orangeRed1" />
                    <h3 className="text-sm font-bold text-blackKnight">Two-Factor Authentication (2FA)</h3>
                  </div>
                  {has2FA ? (
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Enabled & Verified
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      Not Enrolled
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-text-secondary leading-relaxed">
                  Provide an extra layer of security for your admin account using a TOTP Authenticator App (such as Google Authenticator or Microsoft Authenticator).
                </p>

                {has2FA && !enrolling && (
                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
                    <div className="p-3 bg-green-50/70 border border-green-200 rounded-lg text-xs text-green-800">
                      <strong>Status:</strong> Authenticator app is active. You will be prompted for a 6-digit verification code whenever logging into the admin portal.
                    </div>
                    <button 
                      type="button"
                      onClick={startMfaEnrollment} 
                      className="self-start text-xs font-bold text-orangeRed1 hover:text-orange-700 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Reconfigure or Replace Authenticator
                    </button>
                  </div>
                )}

                {!has2FA && !enrolling && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <button 
                      type="button"
                      onClick={startMfaEnrollment} 
                      className="bg-orangeRed1 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-xs font-bold transition-colors shadow-sm"
                    >
                      Set Up Authenticator App
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {enrolling && mfaError && !qrCode && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
                    <p className="font-semibold">{mfaError}</p>
                    <button 
                      type="button"
                      onClick={() => { setEnrolling(false); setMfaError(''); }} 
                      className="block mt-2 font-bold underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Enrollment View: QR Code & Verification Input */}
                {enrolling && qrCode && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-blackKnight">Connect Authenticator App</h4>
                      <button 
                        type="button" 
                        onClick={() => { setEnrolling(false); setQrCode(''); setMfaError(''); }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-blackKnight mb-2">Step 1: Scan this QR Code</p>
                      <p className="text-xs text-text-secondary mb-3">
                        Open Google Authenticator, Microsoft Authenticator, or another compatible TOTP app on your mobile device and scan the QR code below:
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/70 p-4 rounded-xl border border-border">
                        <div className="bg-white p-3 border border-border rounded-lg shadow-sm shrink-0">
                          {qrCode.startsWith('<svg') ? (
                            <div 
                              className="w-44 h-44 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" 
                              dangerouslySetInnerHTML={{ __html: qrCode }} 
                            />
                          ) : (
                            <img src={qrCode} alt="TOTP QR Code" className="w-44 h-44 object-contain" />
                          )}
                        </div>

                        <div className="text-xs text-text-secondary space-y-2 flex-1 min-w-0">
                          <p className="font-semibold text-blackKnight">Cannot scan the QR code?</p>
                          <p>You can enter the secret setup key manually into your authenticator app:</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] bg-white border border-gray-300 px-2 py-1.5 rounded select-all break-all text-blackKnight font-bold">
                              {totpSecret}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(totpSecret)}
                              className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 shrink-0"
                              title="Copy setup key"
                            >
                              {copiedSecret ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                          {copiedSecret && <span className="text-[11px] text-green-600 font-semibold block">Key copied to clipboard!</span>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-blackKnight mb-2">Step 2: Enter the 6-Digit Verification Code</p>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        maxLength={6}
                        value={mfaCode} 
                        onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))} 
                        placeholder="000000" 
                        className="block w-full max-w-[200px] rounded-md border border-gray-300 py-2.5 px-3 text-center text-lg tracking-widest font-mono focus:ring-orangeRed1 focus:border-orangeRed1 bg-white mb-2"
                      />
                      {mfaError && <p className="text-xs text-red-600 font-medium mb-2">{mfaError}</p>}
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={verifyMfa} 
                          disabled={isVerifyingMfa || mfaCode.length < 6}
                          className="bg-orangeRed1 hover:bg-orange-700 disabled:opacity-50 text-white px-5 py-2 rounded-md text-xs font-bold transition-colors shadow-sm"
                        >
                          {isVerifyingMfa ? 'Verifying...' : 'Verify & Complete Enrollment'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setEnrolling(false); setQrCode(''); setMfaError(''); }}
                          className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Re-authentication Modal for Replacing Factor */}
            {showReauthModal && (
              <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 px-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                  <button 
                    onClick={() => { setShowReauthModal(false); setReauthError(''); setReauthCode(''); }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-3 mb-3 text-orangeRed1">
                    <Key className="h-6 w-6" />
                    <h3 className="text-lg font-heading font-bold text-blackKnight">Security Verification</h3>
                  </div>
                  <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                    Please verify your current authenticator code before making security changes to your account.
                  </p>

                  <form onSubmit={handleReauthAndReplace} className="space-y-4">
                    {reauthError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-xs font-medium">
                        {reauthError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-blackKnight mb-1">Current 6-Digit Authenticator Code</label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        value={reauthCode}
                        onChange={(e) => setReauthCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="000000"
                        className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-center text-lg tracking-widest font-mono focus:ring-orangeRed1 focus:border-orangeRed1 bg-white"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => { setShowReauthModal(false); setReauthError(''); setReauthCode(''); }}
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isReauthenticating || reauthCode.length < 6}
                        className="px-4 py-2 text-xs font-bold text-white bg-orangeRed1 hover:bg-orange-700 disabled:opacity-50 rounded-md shadow-sm"
                      >
                        {isReauthenticating ? 'Verifying...' : 'Verify & Continue'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
