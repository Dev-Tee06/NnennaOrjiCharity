'use client';

import { Search, ChevronDown, Bell, Plus, MoreHorizontal, CheckCircle2, AlertTriangle, X, Send, Mail, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
import { RolesManagement } from '@/components/dashboard/RolesManagement';

export default function AdminRolesPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [defaultCoordinators, setDefaultCoordinators] = useState<any[]>([]);
  const [customRoles, setCustomRoles] = useState<any[]>([]);
  const [mainTab, setMainTab] = useState<'Admins' | 'Roles'>('Admins');
  const supabase = createClient();

  useEffect(() => {
    fetchAdmins();
    fetchDefaultCoordinators();
    fetchCustomRoles();
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

  const fetchCustomRoles = async () => {
    const { data } = await supabase.from('custom_roles').select('*');
    if (data) setCustomRoles(data);
  };

  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchAdmins = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role, status, email, full_name, is_role_coordinator, role_coordinator_quota').eq('id', user.id).single();
      setCurrentUser({
        ...profile,
        id: user.id,
        email: user.email || profile?.email,
        name: profile?.full_name || user.user_metadata?.full_name || 'Admin'
      });
    }

    const { data } = await supabase.from('profiles').select('*, custom_roles:custom_role_id(name)').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map((u: any) => {
        let displayStatus = u.status || 'Active';
        if (u.onboarding_status === 'Pending Setup' && u.status !== 'Revoked' && u.status !== 'Suspended') {
          displayStatus = 'Invitation Pending';
        }
        
        let statusBadgeClass = 'text-green-700 bg-green-50 border border-green-200';
        if (displayStatus === 'Invitation Pending' || displayStatus === 'Pending Setup') {
          statusBadgeClass = 'text-amber-700 bg-amber-50 border border-amber-200';
        }
        if (displayStatus === 'Revoked' || displayStatus === 'Suspended') {
          statusBadgeClass = 'text-red-700 bg-red-50 border border-red-200';
        }

        let displayRole = u.role || 'Invited User';
        if (u.custom_roles && u.custom_roles.name) {
          displayRole = u.custom_roles.name;
        }

        return {
          id: u.id,
          name: u.full_name || 'N/A',
          email: u.email || 'N/A',
          role: displayRole,
          has_custom_role: !!u.custom_role_id,
          roleColor: u.role === 'Super Admin' ? 'bg-blackKnight text-white' : (u.custom_role_id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'),
          date: u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          status: displayStatus,
          statusBadgeClass: statusBadgeClass,
          isPending: displayStatus === 'Invitation Pending' || displayStatus === 'Pending Setup',
          is_role_coordinator: u.is_role_coordinator || false,
          role_coordinator_quota: u.role_coordinator_quota || 0
        };
      });
      setAdmins(formatted);
    }
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);
  const [showCoordinatorSettingsModal, setShowCoordinatorSettingsModal] = useState(false);
  const [editingCoordinatorUser, setEditingCoordinatorUser] = useState<any>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState<any>(null);
  const [permissionsData, setPermissionsData] = useState<any[]>([]);
  const [showSuccessBanner, setShowSuccessBanner] = useState('');

  const [inviteError, setInviteError] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Security Confirmation State
  const [securityAction, setSecurityAction] = useState<{title: string, action: () => void, description: string} | null>(null);
  const [securityEmail, setSecurityEmail] = useState('');
  const [securityError, setSecurityError] = useState('');

  const executeSecurityAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityEmail.trim().toLowerCase() !== currentUser?.email?.toLowerCase()) {
      setSecurityError('Email does not match your logged-in account.');
      return;
    }
    
    // Log this explicit confirmation to the audit logs directly
    await supabase.from('admin_activity_logs').insert({
      actor_id: currentUser.id,
      action: 'SECURITY_CONFIRMATION',
      resource: 'Admin Portal',
      details: { action_title: securityAction?.title, confirmed_email: securityEmail }
    });

    // Notify all active Admins for maximum transparency
    const { data: allAdmins } = await supabase.from('profiles').select('id').eq('status', 'Active');
    if (allAdmins) {
      const notifications = allAdmins.map(admin => ({
        user_id: admin.id,
        title: 'System Change Alert',
        message: `${currentUser.name} (${currentUser.email}) executed: ${securityAction?.title}`,
        type: 'AuditAlert',
        link_url: '/admin/roles'
      }));
      await supabase.from('notifications').insert(notifications);
    }

    setSecurityError('');
    setSecurityEmail('');
    if (securityAction) {
      securityAction.action();
      setSecurityAction(null);
    }
  };

  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  const handleResendInvite = async (admin: any) => {
    setResendingEmail(admin.email);
    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend', email: admin.email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resend invitation');

      setShowSuccessBanner(`Admin invitation resent successfully to ${admin.email}.`);
      setTimeout(() => setShowSuccessBanner(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to resend invitation.');
    } finally {
      setResendingEmail(null);
    }
  };

  const [resettingMfaEmail, setResettingMfaEmail] = useState<string | null>(null);

  const handleResetMfa = async (admin: any) => {
    if (!confirm(`Reset 2FA for ${admin.name}? They will be required to scan a new QR code on their next login.`)) {
      return;
    }
    setResettingMfaEmail(admin.email);
    try {
      const response = await fetch('/api/admin/mfa/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin_reset', userId: admin.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset 2FA');

      setShowSuccessBanner(`2FA reset successfully for ${admin.name}. They can now scan a new QR code upon login.`);
      setTimeout(() => setShowSuccessBanner(''), 4000);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to reset 2FA.');
    } finally {
      setResettingMfaEmail(null);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setIsInviting(true);
    
    const form = e.target as HTMLFormElement;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const roleValue = (form.elements.namedItem('role') as HTMLSelectElement).value;
    
    let role = roleValue;
    let custom_role_id = null;
    if (roleValue.startsWith('custom:')) {
      role = 'Standard Admin';
      custom_role_id = roleValue.replace('custom:', '');
    }

    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, role, permissions: [], custom_role_id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send invite');

      setShowAddModal(false);
      setShowSuccessBanner('Admin invitation sent successfully.');
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
    fetchDefaultCoordinators();
  };

  const handleEditPermissions = async (user: any) => {
    setEditingPermissionsUser(user);
    // Fetch current permissions
    const { data } = await supabase.from('admin_permissions').select('*').eq('profile_id', user.id);
    
    // Default modules if not present
    const defaultModules = [
      'Dashboard Overview', 'Pledges & Donations', 'Partnership Inquiries', 
      'Admin & Role Management', 'System Settings'
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
        
        {/* Tab Switcher */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setMainTab('Admins')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${mainTab === 'Admins' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Admin Access
          </button>
          <button 
            onClick={() => setMainTab('Roles')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${mainTab === 'Roles' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Defined System Roles & Access Levels
          </button>
        </div>

        {mainTab === 'Roles' ? (
          <RolesManagement currentUser={currentUser} />
        ) : (
          <>
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
          {(currentUser?.role === 'Super Admin' || currentUser?.is_role_coordinator) && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orangeRed1 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Admin Account
            </button>
          )}
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${admin.statusBadgeClass}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-bold">
                        <div className="flex justify-end items-center gap-2">
                          {currentUser?.role === 'Super Admin' && (
                            <>
                              {admin.isPending && (
                                <button 
                                  onClick={() => handleResendInvite(admin)}
                                  disabled={resendingEmail === admin.email}
                                  className="px-2.5 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs font-bold text-orangeRed1 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors disabled:opacity-50"
                                  title="Resend invitation email"
                                >
                                  <Send className="h-3 w-3" />
                                  {resendingEmail === admin.email ? 'Sending...' : 'Resend Invite'}
                                </button>
                              )}
                              {!admin.isPending && (
                                <button
                                  onClick={() => handleResetMfa(admin)}
                                  disabled={resettingMfaEmail === admin.email}
                                  className="px-2.5 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs border border-transparent text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors disabled:opacity-50"
                                  title="Reset 2FA / Allow user to re-scan QR code"
                                >
                                  <RefreshCw className={`h-3 w-3 ${resettingMfaEmail === admin.email ? 'animate-spin' : ''}`} />
                                  {resettingMfaEmail === admin.email ? 'Resetting...' : 'Reset 2FA'}
                                </button>
                              )}
                              <button 
                                onClick={() => handleEditPermissions(admin)}
                                disabled={['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email) || admin.has_custom_role}
                                className={`px-3 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs border border-transparent ${['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email) || admin.has_custom_role ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:border-blue-200'}`}
                                title={admin.has_custom_role ? "Custom role permissions are managed in the Roles tab" : ""}
                              >
                                Edit Access
                              </button>
                              <button 
                                onClick={() => {
                                  const dbUser = admins.find(a => a.id === admin.id);
                                  setEditingCoordinatorUser(dbUser);
                                  setShowCoordinatorSettingsModal(true);
                                }}
                                disabled={['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email) || admin.role === 'Super Admin'}
                                className={`px-3 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs border border-transparent ${['danielorjikalu102@gmail.com', 'tomisinbabayode@gmail.com'].includes(admin.email) || admin.role === 'Super Admin' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:text-purple-800 bg-purple-50 hover:border-purple-200'}`}
                              >
                                Role Coordinator
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
                    {currentUser?.role === 'Super Admin' && (
                      <option value="Super Admin">Super Admin</option>
                    )}
                    {customRoles.map(cr => (
                      <option key={cr.id} value={`custom:${cr.id}`}>{cr.name} (Custom)</option>
                    ))}
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
                <button onClick={() => {
                  setShowRevokeModal(false);
                  setSecurityAction({
                    title: 'Revoke Admin Access',
                    description: `You are about to revoke access for ${revokingUser.name}.`,
                    action: handleRevoke
                  });
                }} className="flex-1 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm">Revoke Access</button>
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
                            disabled={!perm.can_view}
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
                            disabled={!perm.can_view}
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
                            disabled={!perm.can_view}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end gap-3 pt-2 shrink-0 border-t border-gray-100 mt-2">
                <button type="button" onClick={() => setShowPermissionsModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button onClick={() => {
                  setShowPermissionsModal(false);
                  setSecurityAction({
                    title: 'Update Admin Permissions',
                    description: `You are about to change module access permissions for ${editingPermissionsUser?.name}.`,
                    action: handleSavePermissions
                  });
                }} className="px-4 py-2 text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 rounded-md shadow-sm">Save Permissions</button>
              </div>
            </div>
          </div>
        )}

        {showCoordinatorSettingsModal && editingCoordinatorUser && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              <button onClick={() => setShowCoordinatorSettingsModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-heading font-bold text-blackKnight mb-2">
                Role Coordinator Settings
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Grant <strong>{editingCoordinatorUser.name}</strong> the ability to invite users and manage their own members.
              </p>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input 
                    type="checkbox"
                    checked={editingCoordinatorUser.is_role_coordinator}
                    onChange={(e) => setEditingCoordinatorUser({...editingCoordinatorUser, is_role_coordinator: e.target.checked})}
                    className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded"
                  />
                  <span className="ml-3 font-bold text-sm text-blackKnight">Is Role Coordinator</span>
                </label>

                {editingCoordinatorUser.is_role_coordinator && (
                  <div>
                    <label className="block text-sm font-bold text-blackKnight mb-1.5">Invitation Quota</label>
                    <input 
                      type="number"
                      min="0"
                      value={editingCoordinatorUser.role_coordinator_quota}
                      onChange={(e) => setEditingCoordinatorUser({...editingCoordinatorUser, role_coordinator_quota: parseInt(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1"
                    />
                    <p className="text-xs text-text-secondary mt-1">Number of admins this coordinator can invite.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowCoordinatorSettingsModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button 
                  onClick={async () => {
                    await supabase.from('profiles').update({
                      is_role_coordinator: editingCoordinatorUser.is_role_coordinator,
                      role_coordinator_quota: editingCoordinatorUser.role_coordinator_quota
                    }).eq('id', editingCoordinatorUser.id);
                    
                    setShowCoordinatorSettingsModal(false);
                    setShowSuccessBanner('Coordinator settings updated.');
                    setTimeout(() => setShowSuccessBanner(''), 3000);
                    fetchAdmins();
                  }}
                  className="px-4 py-2 text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 rounded-md shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {securityAction && (
          <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 px-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
              <button 
                onClick={() => { setSecurityAction(null); setSecurityError(''); setSecurityEmail(''); }} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-2 text-orangeRed1">
                <AlertTriangle className="h-6 w-6" />
                <h2 className="text-xl font-heading font-bold text-blackKnight">Security Confirmation</h2>
              </div>
              
              <p className="text-sm text-text-secondary mb-6">
                {securityAction.description}
                <br /><br />
                To execute this change and record it in the audit log, please type your email address <strong>({currentUser?.email})</strong> below to confirm.
              </p>
              
              <form onSubmit={executeSecurityAction} className="space-y-4">
                {securityError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm font-medium">
                    {securityError}
                  </div>
                )}
                
                <div>
                  <input 
                    type="email" 
                    required
                    value={securityEmail}
                    onChange={(e) => setSecurityEmail(e.target.value)}
                    placeholder="Enter your email to confirm"
                    className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm focus:ring-2 focus:ring-orangeRed1 focus:border-orangeRed1 font-medium" 
                    autoComplete="off"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setSecurityAction(null); setSecurityError(''); setSecurityEmail(''); }} 
                    className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-bold text-white bg-blackKnight hover:bg-gray-900 rounded-md shadow-sm"
                  >
                    Confirm & Execute
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </>
        )}

      </div>
    </div>
  );
}
