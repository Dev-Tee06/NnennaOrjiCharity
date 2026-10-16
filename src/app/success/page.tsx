"use client";

import { Button } from '@/components/Button';
import { CheckCircle2, CheckCheck, Copy } from 'lucide-react';
import { useState } from 'react';

export default function SuccessPage() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async (email: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.setAttribute('readonly', 'true');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopyStatus('success');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  return (
    <div className="min-h-[80vh] bg-offWhite flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-sm rounded-[14px] border border-border p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-[28px] font-heading font-bold text-blackKnight mb-3">
          Successfully Submitted
        </h2>

        <p className="text-[15px] font-body text-text-secondary leading-relaxed mb-8">
          Thank you! We have received your submission. A member of our team will review it and get back to you shortly if necessary.
        </p>

        <div className="w-full rounded-[12px] border border-[#E6E8EC] bg-[#F7F7F7] p-3 text-left mb-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-blackKnight/80">
              NEED IMMEDIATE SUPPORT? Reach us here:
            </span>
            <button
              type="button"
              onClick={() => handleCopy('support@nnennaorjicharityfoundation.org')}
              aria-label="Copy support email"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#D9DDE3] bg-white text-blackKnight transition-colors hover:border-orangeRed1 hover:text-orangeRed1"
            >
              {copyStatus === 'success' ? <CheckCheck className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-3">
            <a
              href="mailto:support@nnennaorjicharityfoundation.org"
              className="block break-all font-body text-[15px] font-medium text-blackKnight underline decoration-black/20 underline-offset-4"
            >
              support@nnennaorjicharityfoundation.org
            </a>
          </div>

          {copyStatus !== 'idle' && (
            <p className="mt-2 text-[12px] text-emerald-600">
              {copyStatus === 'success' ? 'Email copied!' : 'Unable to copy email.'}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button href="/" variant="primary" className="w-full justify-center">
            Return to Home
          </Button>
          <Button href="/donate" variant="outline" className="w-full justify-center text-text-secondary border-border-subtle hover:text-blackKnight">
            Make another pledge
          </Button>
        </div>
      </div>
    </div>
  );
}
