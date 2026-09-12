import Link from 'next/link';
import { Button } from '@/components/Button';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
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
