'use client';

import { Search, ChevronDown, Bell, Plus, MoreHorizontal, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
export default function AdminRolesPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchAdmins();
    const channel = supabase
      .channel('admins-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_users' }, fetchAdmins)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAdmins = async () => {
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map((u: any) => ({
        id: u.id,
        name: u.full_name || 'N/A',
        email: u.email || 'N/A',
        role: u.role || 'Invited User',
        roleColor: u.role === 'Super Admin' ? 'bg-blackKnight text-white' : 'bg-gray-100 text-gray-700',
        date: u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        status: u.status || 'Active',
        statusColor: u.status === 'Revoked' ? 'text-red-600' : 'text-green-600'
      }));
      setAdmins(formatted);
    }
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState('');

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    setShowSuccessBanner('Admin Account Created Successfully');
    setTimeout(() => setShowSuccessBanner(''), 3000);
  };

  const handleRevoke = () => {
    setShowRevokeModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      {/* Page Header */}
      <TopHeader title="Admin Portal Users & Permissions" />
      <MobilePageTitle title="Admin Portal Users & Permissions" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        
        {showSuccessBanner && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold">{showSuccessBanner}</span>
            </div>
            <button onClick={() => setShowSuccessBanner('')} className="text-green-800 hover:text-green-900 text-sm font-bold bg-white px-3 py-1 rounded-md border border-green-200 shadow-sm">
              View Audit Log
            </button>
          </div>
        )}

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-6">
          <p className="text-xs text-orange-800 font-medium">
            <span className="font-bold">Note:</span> Super Admin role has access to all pages and can add/remove other admins.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 w-full w-full">
          <div>
            <h2 className="text-2xl font-heading font-bold text-blackKnight">Admin Portal Users & Permissions</h2>
            <p className="text-sm text-text-secondary mt-1">Manage Admin access levels, reset passwords, or revoke access to the dashboard below.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orangeRed1 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add New Admin
          </button>
        </div>

        {/* Table Area */}
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] w-full min-w-0">
          
          <div className="overflow-x-auto flex-1 flex flex-col w-full min-w-0">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Admin Full Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Assigned Role</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Date Added</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-text-secondary">
                      No admin users found. Click "Add New Admin" to create one.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-bold text-blackKnight flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {admin.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        {admin.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{admin.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${admin.roleColor}`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{admin.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`font-bold ${admin.statusColor}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-bold">
                        <button 
                          onClick={() => setShowRevokeModal(true)}
                          className="text-gray-400 hover:text-blackKnight bg-gray-100 px-2 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs ml-auto border border-transparent hover:border-gray-300"
                        >
                          Edit / Revoke <MoreHorizontal className="h-3 w-3 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-heading font-bold text-blackKnight mb-6">Create New Admin Account</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Admin Full Name</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Email Address</label>
                  <input type="email" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Assign System Role</label>
                  <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-white">
                    <option>Select role access...</option>
                    <option>Super Admin</option>
                    <option>Invited User</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 rounded-md shadow-sm">Create Admin Account</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRevokeModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-lg font-heading font-bold text-blackKnight mb-2">Revoke Access for user?</h2>
              <p className="text-sm text-text-secondary mb-6">
                Are you sure you want to revoke access? They will be immediately logged out.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowRevokeModal(false)} className="flex-1 py-2 text-sm font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md">Cancel</button>
                <button onClick={handleRevoke} className="flex-1 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm">Revoke Access</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
