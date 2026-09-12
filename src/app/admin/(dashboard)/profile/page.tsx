'use client';

import { Search, Bell, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
export default function ProfilePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState<{name: string, initial: string, email: string} | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
        setUser({
          name: name,
          initial: name.charAt(0).toUpperCase(),
          email: user.email || ''
        });
      } else {
        setUser({ name: 'Admin', initial: 'A', email: '' });
      }
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      {/* Page Header */}
      <TopHeader title="Edit Admin Profile" />
      <MobilePageTitle title="Edit Admin Profile" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-bold">Profile Changes Saved</span>
            </div>
            <Link href="/admin">
              <button className="bg-blackKnight hover:bg-gray-800 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors">
                Return to Dashboard
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white border border-border rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 rounded-full bg-orangeRed1 flex items-center justify-center text-white text-2xl font-bold">
                EO
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-blackKnight">{user?.name || 'Loading...'}</h2>
                <p className="text-xs text-text-secondary mt-1">Account Created Oct 22, 2026. Last active just now.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Full Name</label>
                  <input type="text" value={user?.name || ''} readOnly disabled
                    className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Active Contact Email</label>
                  <input type="email" value={user?.email || ''} readOnly disabled
                    className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Phone Number</label>
                  <input
                    type="text"
                    defaultValue="+234 803 000 0000"
                    className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">System Job Title</label>
                  <input
                    type="text"
                    defaultValue="Super Admin / IT Systems Lead"
                    className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-bold text-blackKnight hover:bg-gray-100 rounded-md transition-colors mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-border rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-blackKnight mb-4 border-b border-border pb-4">Security & Permissions Access Box</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text-secondary">Current Status</span>
                  <span className="text-xs font-bold text-green-600">Active (Online)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text-secondary">Date Added</span>
                  <span className="text-xs font-bold text-blackKnight">Nov 25, 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text-secondary">Assigned Role</span>
                  <span className="text-xs font-bold text-blackKnight">Super Admin (Admin)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs font-semibold text-text-secondary">Average Weekly Logins</span>
                  <span className="text-xs font-bold text-blackKnight">42 Total Logins</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-red-900 mb-2">Revoke account Access temporarily?</h3>
              <p className="text-xs text-red-800 leading-relaxed mb-6">
                By revoking access, this user will no longer be able to access the admin portal. They will be logged out immediately.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm">
                  Revoke User Access
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-red-600 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm border border-red-200">
                  Perm. Delete User Profile
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
