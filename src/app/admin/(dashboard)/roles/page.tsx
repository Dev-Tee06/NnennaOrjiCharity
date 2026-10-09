'use client';

import { Search, ChevronDown, Bell, Plus, MoreHorizontal, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
export default function AdminRolesPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [defaultCoordinators, setDefaultCoordinators] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchAdmins();
    fetchDefaultCoordinators();
    const channel = supabase
      .channel('admins-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchAdmins();
        fetchDefaultCoordinators();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchDefaultCoordinators = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('is_default_coordinator', true);
    if (data && data.length > 0) {
      setDefaultCoordinators(data.map((d: any) => ({
        id: d.id,
        name: d.full_name || 'N/A',
        email: d.email || 'N/A',
        role: d.role || 'N/A',
        status: d.status || 'Active',
      })));
    } else {
      setDefaultCoordinators([]);
    }
  };

  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchAdmins = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single();
      setCurrentUser(profile);
    }

    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map((u: any) => {
        let displayStatus = u.status || 'Active';
        if (u.onboarding_status === 'Pending Setup' && u.status !== 'Revoked' && u.status !== 'Suspended') {
          displayStatus = 'Pending Setup';
        }
        
        let statusColor = 'text-green-600';
        if (displayStatus === 'Pending Setup') statusColor = 'text-orange-600';
        if (displayStatus === 'Revoked' || displayStatus === 'Suspended') statusColor = 'text-red-600';

        return {
          id: u.id,
          name: u.full_name || 'N/A',
          email: u.email || 'N/A',
          role: u.role || 'Invited User',
          roleColor: u.role === 'Super Admin' ? 'bg-blackKnight text-white' : 'bg-gray-100 text-gray-700',
          date: u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          status: displayStatus,
          statusColor: statusColor
        };
      });
      setAdmins(formatted);
    }
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState<any>(null);
  const [permissionsData, setPermissionsData] = useState<any[]>([]);
  const [showSuccessBanner, setShowSuccessBanner] = useState('');

  const [inviteError, setInviteError] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setIsInviting(true);
    
    const form = e.target as HTMLFormElement;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value;

    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, role, permissions: [] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send invite');

      setShowAddModal(false);
      setShowSuccessBanner('Admin Account Created and Invitation Sent');
      setTimeout(() => setShowSuccessBanner(''), 4000);
      fetchAdmins();
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const [revokingUser, setRevokingUser] = useState<any>(null);

  const handleRevoke = async () => {
    if (!revokingUser) return;
    
    // Check if the user has outstanding pledges
    const { data: outstanding } = await supabase
      .from('donations')
      .select('id')
      .eq('coordinator_id', revokingUser.id)
      .in('status', ['Pending', 'Processing']);
      
    if (outstanding && outstanding.length > 0) {
      // Notify Super Admin
      const { data: superAdmin } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'Super Admin')
        .eq('status', 'Active')
        .limit(1)
        .single();
        
      if (superAdmin) {
        await supabase.from('notifications').insert({
          user_id: superAdmin.id,
          title: 'Coordinator Deactivated - Pledges Review Needed',
          message: `Coordinator ${revokingUser.name} was deactivated and has ${outstanding.length} outstanding pledges that require reassignment.`,
          type: 'ReviewNeeded',
          link_url: '/admin/donations'
        });
      }
    }
    
    await supabase.from('profiles').update({ status: 'Revoked', is_default_coordinator: false }).eq('id', revokingUser.id);
    setShowRevokeModal(false);
    setRevokingUser(null);
    setShowSuccessBanner('User access revoked successfully.');
    setTimeout(() => setShowSuccessBanner(''), 3000);
    fetchAdmins();
    fetchDefaultCoordinator();
  };

  const handleEditPermissions = async (user: any) => {
    setEditingPermissionsUser(user);
    // Fetch current permissions
    const { data } = await supabase.from('admin_permissions').select('*').eq('profile_id', user.id);
    
    // Default modules if not present
    const defaultModules = [
      'Dashboard', 'Admin Role & Management', 'Pledges & Records', 
      'Pages & Content', 'Reports & Analytics', 'Notifications & Activity Logs', 'Platform Settings'
    ];
    
    const formattedData = defaultModules.map(mod => {
      const existing = data?.find((d: any) => d.module === mod);
      return existing || { module: mod, can_view: false, can_create: false, can_edit: false, can_delete: false };
    });
    
    setPermissionsData(formattedData);
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = async () => {
    if (!editingPermissionsUser) return;
    
    // First, map permissions with profile_id
    const toUpsert = permissionsData.map(p => ({
      profile_id: editingPermissionsUser.id,
      module: p.module,
      can_view: p.can_view,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete
    }));

    await supabase.from('admin_permissions').upsert(toUpsert, { onConflict: 'profile_id,module' });
    
    // Log activity
    await supabase.from('admin_activity_logs').insert({
      actor_id: (await supabase.auth.getUser()).data.user?.id,
      action: 'UPDATE_PERMISSIONS',
      resource: editingPermissionsUser.id,
      details: { updated_modules: toUpsert.map(u => u.module) }
    });

    setShowPermissionsModal(false);
    setEditingPermissionsUser(null);
    setShowSuccessBanner('Permissions updated successfully.');
    setTimeout(() => setShowSuccessBanner(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      {/* Page Header */}
      <TopHeader title="Admin Portal Users & Permissions" />
      <MobilePageTitle title="Admin Portal Users & Permissions" />

      <div className="flex-1 overflow-y-auto p-4 md:p-4 relative">
        
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 w-full">
          <div>
            <h2 className="text-2xl font-heading font-bold text-blackKnight">Admin Portal Users & Permissions</h2>
            <p className="text-sm text-text-secondary mt-1">Manage Admin access levels, reset passwords, or revoke access to the dashboard below.</p>
          </div>
          {currentUser?.role === 'Super Admin' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orangeRed1 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add New Admin
            </button>
          )}
        </div>

        {/* Default Pledge Coordinator Section */}
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden mb-6 w-full min-w-0 p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-blackKnight">Default Pledge Coordinators</h3>
              <p className="text-sm text-text-secondary mt-1">
                New pledges are automatically distributed among these administrators.
              </p>
            </div>
            {currentUser?.role === 'Super Admin' && (
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => setShowCoordinatorModal(true)}
                  className="w-full md:w-auto px-4 py-2 text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md shadow-sm border border-gray-300 transition-colors"
                >
                  Manage Coordinators
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-5 p-4 rounded-lg border border-transparent">
            {defaultCoordinators.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {defaultCoordinators.map((coord: any) => (
                  <div key={coord.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center gap-4 relative pr-10">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orangeRed1 shrink-0">
                      {coord.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-base font-bold text-blackKnight">{coord.name}</h4>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1 text-sm text-text-secondary">
                        <span>{coord.email}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="font-medium text-gray-700">{coord.role}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className={coord.status === 'Active' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {coord.status}
                        </span>
                      </div>
                    </div>
                    {currentUser?.role === 'Super Admin' && (
                      <button 
                        onClick={async () => {
                          await supabase.from('profiles').update({ is_default_coordinator: false }).eq('id', coord.id);
                          setShowSuccessBanner('Coordinator removed successfully.');
                          setTimeout(() => setShowSuccessBanner(''), 3000);
                          fetchDefaultCoordinators();
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove Coordinator"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic py-2 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                No default coordinator assigned. New pledges will be marked as "Pending Assignment".
              </div>
            )}
          </div>
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
                        <div className="flex justify-end gap-2">
                          {currentUser?.role === 'Super Admin' && (
                            <>
                              <button 
                                onClick={() => handleEditPermissions(admin)}
                                disabled={['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email)}
                                className={`px-3 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs border border-transparent ${['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:border-blue-200'}`}
                              >
                                Edit Access
                              </button>
                              <button 
                                onClick={() => {
                                  setRevokingUser(admin);
                                  setShowRevokeModal(true);
                                }}
                                className={`px-3 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs border border-transparent ${['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email) || admin.role === 'Super Admin' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800 bg-red-50 hover:border-red-200'}`}
                                disabled={['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email) || admin.role === 'Super Admin'}
                              >
                                Revoke
                              </button>
                            </>
                          )}
                        </div>
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
                {inviteError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
                    {inviteError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Admin Full Name</label>
                  <input name="fullName" type="text" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Email Address</label>
                  <input name="email" type="email" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Assign System Role</label>
                  <select name="role" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-white">
                    <option value="Standard Admin">Standard Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" disabled={isInviting} className="px-4 py-2 text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 rounded-md shadow-sm disabled:opacity-50">
                    {isInviting ? 'Creating...' : 'Create Admin Account'}
                  </button>
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
                <button onClick={() => {
                  setShowRevokeModal(false);
                  setRevokingUser(null);
                }} className="flex-1 py-2 text-sm font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md">Cancel</button>
                <button onClick={handleRevoke} className="flex-1 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm">Revoke Access</button>
              </div>
            </div>
          </div>
        )}

        {showCoordinatorModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              <button onClick={() => setShowCoordinatorModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-heading font-bold text-blackKnight mb-2">Assign Default Coordinator</h2>
              <p className="text-sm text-text-secondary mb-6">
                Select an administrator to be assigned all new pledges automatically.
              </p>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 border border-gray-200 rounded-md p-2">
                {admins.filter(a => a.status === 'Active').length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">No active administrators available.</div>
                )}
                {admins.filter(a => a.status === 'Active').map(admin => (
                  <label key={admin.id} className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer border border-transparent hover:border-gray-200">
                    <input 
                      type="checkbox" 
                      name="coordinator" 
                      value={admin.id}
                      defaultChecked={defaultCoordinators.some(c => c.id === admin.id)}
                      onChange={async (e) => {
                        const isChecked = e.target.checked;
                        await supabase.from('profiles').update({ is_default_coordinator: isChecked }).eq('id', admin.id);
                        setShowSuccessBanner(isChecked ? 'Coordinator added successfully.' : 'Coordinator removed successfully.');
                        setTimeout(() => setShowSuccessBanner(''), 3000);
                        fetchDefaultCoordinators();
                      }}
                      className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-bold text-gray-900">{admin.name}</span>
                      <span className="block text-xs text-gray-500">{admin.email} - {admin.role}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-end gap-3 pt-2 mt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowCoordinatorModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Done</button>
              </div>
            </div>
          </div>
        )}

        {showPermissionsModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] flex flex-col">
              <button onClick={() => setShowPermissionsModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-heading font-bold text-blackKnight mb-2">
                Edit Access: {editingPermissionsUser?.name}
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Configure module access and action permissions for this administrator.
              </p>
              
              <div className="overflow-y-auto flex-1 mb-6 border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-bold text-gray-500 uppercase">Module</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">View</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">Create</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">Edit</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {permissionsData.map((perm, idx) => (
                      <tr key={perm.module}>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">{perm.module}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={perm.can_view}
                            onChange={(e) => {
                              const newData = [...permissionsData];
                              newData[idx].can_view = e.target.checked;
                              setPermissionsData(newData);
                            }}
                            className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={perm.can_create}
                            onChange={(e) => {
                              const newData = [...permissionsData];
                              newData[idx].can_create = e.target.checked;
                              setPermissionsData(newData);
                            }}
                            className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded"
                            disabled={!perm.can_view && ['Reports & Analytics', 'Notifications & Activity Logs'].includes(perm.module)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={perm.can_edit}
                            onChange={(e) => {
                              const newData = [...permissionsData];
                              newData[idx].can_edit = e.target.checked;
                              setPermissionsData(newData);
                            }}
                            className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded"
                            disabled={!perm.can_view && ['Notifications & Activity Logs'].includes(perm.module)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={perm.can_delete}
                            onChange={(e) => {
                              const newData = [...permissionsData];
                              newData[idx].can_delete = e.target.checked;
                              setPermissionsData(newData);
                            }}
                            className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded"
                            disabled={!perm.can_view && ['Dashboard', 'Reports & Analytics', 'Notifications & Activity Logs'].includes(perm.module)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end gap-3 pt-2 shrink-0 border-t border-gray-100 mt-2">
                <button type="button" onClick={() => setShowPermissionsModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button onClick={handleSavePermissions} className="px-4 py-2 text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 rounded-md shadow-sm">Save Permissions</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
