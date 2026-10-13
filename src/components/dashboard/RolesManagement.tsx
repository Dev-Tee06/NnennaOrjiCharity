'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Shield, Plus, MoreHorizontal, Settings, Users, AlertTriangle, X, Trash2, Edit } from 'lucide-react';

export function RolesManagement({ currentUser }: { currentUser: any }) {
  const [roles, setRoles] = useState<any[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeRole, setActiveRole] = useState<any>(null);
  
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [permissionsData, setPermissionsData] = useState<any[]>([]);
  
  const [allAdmins, setAllAdmins] = useState<any[]>([]);
  const [roleAdmins, setRoleAdmins] = useState<any[]>([]);
  
  const [showSuccessBanner, setShowSuccessBanner] = useState('');

  const supabase = createClient();

  const defaultModules = [
    'Dashboard Overview', 'Pledges & Donations', 'Partnership Inquiries', 
    'Admin & Role Management', 'System Settings'
  ];

  useEffect(() => {
    fetchRoles();
    fetchAllAdmins();
  }, []);

  const fetchRoles = async () => {
    const { data: customRoles } = await supabase.from('custom_roles').select('*').order('created_at', { ascending: true });
    if (customRoles) {
      setRoles(customRoles);
    }
  };

  const fetchAllAdmins = async () => {
    const { data } = await supabase.from('profiles').select('*').in('status', ['Active', 'Pending Setup']);
    if (data) {
      setAllAdmins(data);
    }
  };

  const openCreateModal = () => {
    setActiveRole(null);
    setRoleName('');
    setRoleDesc('');
    setPermissionsData(defaultModules.map(mod => ({
      module: mod, can_view: false, can_create: false, can_edit: false, can_delete: false
    })));
    setShowRoleModal(true);
  };

  const openEditModal = async (role: any) => {
    setActiveRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description || '');
    
    const { data } = await supabase.from('custom_role_permissions').select('*').eq('role_id', role.id);
    const formattedData = defaultModules.map(mod => {
      const existing = data?.find((d: any) => d.module === mod);
      return existing || { module: mod, can_view: false, can_create: false, can_edit: false, can_delete: false };
    });
    setPermissionsData(formattedData);
    setShowRoleModal(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    let roleId = activeRole?.id;

    if (roleId) {
      // Update
      await supabase.from('custom_roles').update({ name: roleName, description: roleDesc }).eq('id', roleId);
    } else {
      // Create
      const { data, error } = await supabase.from('custom_roles').insert({
        name: roleName,
        description: roleDesc,
        created_by: currentUser?.id
      }).select('id').single();
      if (error) {
        const isDuplicate = error.message.toLowerCase().includes('duplicate') || error.code === '23505';
        alert(isDuplicate
          ? `A role named "${roleName}" already exists. Please choose a different name.`
          : `Failed to create role: ${error.message}`
        );
        return;
      }
      roleId = data.id;
    }

    // Upsert permissions
    const toUpsert = permissionsData.map(p => ({
      role_id: roleId,
      module: p.module,
      can_view: p.can_view,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete
    }));
    await supabase.from('custom_role_permissions').upsert(toUpsert, { onConflict: 'role_id,module' });

    setShowRoleModal(false);
    setShowSuccessBanner(activeRole ? 'Role updated successfully.' : 'Role created successfully.');
    setTimeout(() => setShowSuccessBanner(''), 3000);
    fetchRoles();
  };

  const openDeleteModal = (role: any) => {
    setActiveRole(role);
    setShowDeleteModal(true);
  };

  const handleDeleteRole = async () => {
    if (!activeRole) return;
    await supabase.from('custom_roles').delete().eq('id', activeRole.id);
    setShowDeleteModal(false);
    setShowSuccessBanner('Role deleted successfully.');
    setTimeout(() => setShowSuccessBanner(''), 3000);
    fetchRoles();
  };

  const openAssignModal = async (role: any) => {
    setActiveRole(role);
    // Fetch users currently assigned to this role
    const { data } = await supabase.from('profiles').select('id').eq('custom_role_id', role.id);
    if (data) {
      setRoleAdmins(data.map(d => d.id));
    }
    setShowAssignModal(true);
  };

  const handleSaveAssignments = async () => {
    if (!activeRole) return;
    
    // Set custom_role_id = null for users that previously had this role but were removed
    await supabase.from('profiles').update({ custom_role_id: null }).eq('custom_role_id', activeRole.id);
    
    // Set custom_role_id for newly assigned users
    if (roleAdmins.length > 0) {
      await supabase.from('profiles').update({ custom_role_id: activeRole.id }).in('id', roleAdmins);
    }

    setShowAssignModal(false);
    setShowSuccessBanner('Admins assigned successfully.');
    setTimeout(() => setShowSuccessBanner(''), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {showSuccessBanner && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 text-green-800">
            <span className="text-sm font-bold">{showSuccessBanner}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
        <div>
          <h2 className="text-2xl font-heading font-bold text-blackKnight">Defined System Roles & Access Levels</h2>
          <p className="text-sm text-text-secondary mt-1">Manage and create custom job roles to assign to your team members.</p>
        </div>
        {currentUser?.role === 'Super Admin' && (
          <button 
            onClick={openCreateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orangeRed1 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create New Role
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Role Placeholder */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-blackKnight">Super Admin</h3>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase mt-1 inline-block">System</span>
            </div>
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm text-text-secondary mb-6 flex-1">Full access to all system modules and settings.</p>
        </div>

        {/* Custom Roles */}
        {roles.map(role => (
          <div key={role.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col relative group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-blackKnight">{role.name}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase mt-1 inline-block">Custom Role</span>
              </div>
              {currentUser?.role === 'Super Admin' && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(role)} className="text-gray-400 hover:text-blue-600 p-1"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => openDeleteModal(role)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                </div>
              )}
            </div>
            <p className="text-sm text-text-secondary mb-6 flex-1">{role.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button onClick={() => openAssignModal(role)} className="text-sm font-bold text-orangeRed1 hover:underline">View Assigned Admins</button>
            </div>
          </div>
        ))}
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] flex flex-col">
            <button onClick={() => setShowRoleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-heading font-bold text-blackKnight mb-6">
              {activeRole ? 'Edit Role' : 'Create New Role'}
            </h2>
            
            <form onSubmit={handleSaveRole} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Role Name</label>
                  <input required value={roleName} onChange={e => setRoleName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-1.5">Description (Optional)</label>
                  <textarea value={roleDesc} onChange={e => setRoleDesc(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" rows={2}></textarea>
                </div>
              </div>

              <h3 className="font-bold text-sm text-blackKnight mb-2">Module Permissions</h3>
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
                          <input type="checkbox" checked={perm.can_view} onChange={(e) => { const newData = [...permissionsData]; newData[idx].can_view = e.target.checked; setPermissionsData(newData); }} className="h-4 w-4 text-orangeRed1 border-gray-300 rounded" />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <input type="checkbox" checked={perm.can_create} onChange={(e) => { const newData = [...permissionsData]; newData[idx].can_create = e.target.checked; setPermissionsData(newData); }} className="h-4 w-4 text-orangeRed1 border-gray-300 rounded" disabled={!perm.can_view} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <input type="checkbox" checked={perm.can_edit} onChange={(e) => { const newData = [...permissionsData]; newData[idx].can_edit = e.target.checked; setPermissionsData(newData); }} className="h-4 w-4 text-orangeRed1 border-gray-300 rounded" disabled={!perm.can_view} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center">
                          <input type="checkbox" checked={perm.can_delete} onChange={(e) => { const newData = [...permissionsData]; newData[idx].can_delete = e.target.checked; setPermissionsData(newData); }} className="h-4 w-4 text-orangeRed1 border-gray-300 rounded" disabled={!perm.can_view} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-2 shrink-0 border-t border-gray-100">
                <button type="button" onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 rounded-md shadow-sm">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && activeRole && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-lg font-heading font-bold text-blackKnight mb-2">Delete Role?</h2>
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to delete the <strong>{activeRole.name}</strong> role? This will remove permissions from all assigned users.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 text-sm font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md">Cancel</button>
              <button onClick={handleDeleteRole} className="flex-1 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm">Delete Role</button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && activeRole && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button onClick={() => setShowAssignModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-heading font-bold text-blackKnight mb-2">Assign Role: {activeRole.name}</h2>
            <p className="text-sm text-text-secondary mb-6">
              Select users to assign this role to.
            </p>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 border border-gray-200 rounded-md p-2">
              {allAdmins.filter(a => a.role !== 'Super Admin').length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">No assignable administrators available.</div>
              )}
              {allAdmins.filter(a => a.role !== 'Super Admin').map(admin => (
                <label key={admin.id} className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer border border-transparent hover:border-gray-200">
                  <input 
                    type="checkbox" 
                    checked={roleAdmins.includes(admin.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRoleAdmins([...roleAdmins, admin.id]);
                      } else {
                        setRoleAdmins(roleAdmins.filter(id => id !== admin.id));
                      }
                    }}
                    className="h-4 w-4 text-orangeRed1 focus:ring-orangeRed1 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">{admin.full_name || 'N/A'}</span>
                    <span className="block text-xs text-gray-500">{admin.email} - {admin.status}</span>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
              <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              {currentUser?.role === 'Super Admin' && (
                <button onClick={handleSaveAssignments} className="px-4 py-2 text-sm font-bold text-white bg-orangeRed1 hover:bg-orange-700 rounded-md shadow-sm">Save Assignments</button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
