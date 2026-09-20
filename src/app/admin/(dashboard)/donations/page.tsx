'use client';

import { Search, ChevronDown, Bell, Filter, Edit, Trash2, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';

export default function PledgesDonationsPage() {
  const [pledges, setPledges] = useState<any[]>([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState('');
  const [editingPledge, setEditingPledge] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    quantity: 1,
    notes: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchPledges();
    const channel = supabase
      .channel('donations-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchPledges)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPledges = async () => {
    const { data } = await supabase.from('donations').select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      donation_type,
      quantity,
      notes,
      message,
      status,
      created_at,
      donors (
        first_name,
        last_name,
        email,
        phone
      )
    `).order('created_at', { ascending: false });
    
    if (data) {
      const formatted = data.map((d: any) => {
        const fName = d.first_name || d.donors?.first_name || 'Anonymous';
        const lName = d.last_name || d.donors?.last_name || '';
        const email = d.email || d.donors?.email || '';
        const phone = d.phone || d.donors?.phone || '';

        return {
          raw_id: d.id,
          id: `PLG-${d.id.substring(0,4)}`,
          donor: `${fName} ${lName}`.trim(),
          email: email,
          phone: phone,
          category: d.donation_type === 'food' ? 'Food Donation' : 
                    d.donation_type === 'cloth' ? 'Clothing Donation' : 
                    d.donation_type === 'medical_supply' ? 'Medical Supplies' : 'Uncategorized',
          categoryColor: d.donation_type === 'food' ? 'text-orange-600 bg-orange-50' :
                         d.donation_type === 'cloth' ? 'text-blue-600 bg-blue-50' :
                         d.donation_type === 'medical_supply' ? 'text-red-600 bg-red-50' :
                         'text-gray-600 bg-gray-50',
          quantity: d.quantity || 1,
          items: `${d.quantity || 1} items`,
          notes: d.notes || '',
          message: d.message || '',
          status: d.status || 'Pending',
          statusColor: ['Completed', 'Resolved', 'Handed Over', 'Received'].includes(d.status) ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
        };
      });
      setPledges(formatted);
    }
  };

  const handleEdit = (pledge: any) => {
    setEditingPledge(pledge);
    setEditForm({
      status: pledge.status,
      quantity: pledge.quantity,
      notes: pledge.notes
    });
    setIsEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingPledge) return;
    const { error } = await supabase
      .from('donations')
      .update({
        status: editForm.status,
        quantity: editForm.quantity,
        notes: editForm.notes
      })
      .eq('id', editingPledge.raw_id);
      
    if (error) {
      alert('Failed to update: ' + error.message);
    } else {
      setIsEditModalOpen(false);
      setEditingPledge(null);
      fetchPledges();
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const { error } = await supabase.from('donations').delete().eq('id', deletingId);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      setDeletingId(null);
      fetchPledges();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full relative">
      {/* Page Header */}
      <TopHeader title="Pledges & Donations" />
      <MobilePageTitle title="Pledges & Donations" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 w-full">
          <div>
            <h2 className="text-2xl font-heading font-bold text-blackKnight">Pledges & Donations</h2>
            <p className="text-sm text-text-secondary mt-1">Monitor and track out all donations globally across the Lagos and Kano outreach runs.</p>
          </div>
          <button 
            onClick={() => setShowRecordModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orangeRed1 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Record New Pledge
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <span className="text-2xl font-heading font-bold text-blackKnight">{pledges.length}</span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Total Pledges</span>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <span className="text-2xl font-heading font-bold text-green-600">
                {pledges.filter(p => ['Completed', 'Handed Over', 'Resolved', 'Received'].includes(p.status)).length}
              </span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Items Collected</span>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <span className="text-2xl font-heading font-bold text-blue-600">
                {pledges.filter(p => p.status === 'In Transit').length}
              </span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Active Deliveries</span>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <span className="text-2xl font-heading font-bold text-orangeRed1">
                {pledges.filter(p => p.status === 'Pending').length}
              </span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Outstanding Pickups</span>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] w-full min-w-0">
          
          <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50 flex-wrap gap-3">
            <div className="relative w-full md:w-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full md:w-64 rounded-md border border-gray-200 py-1.5 pl-9 pr-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1"
                placeholder="Search specific donor or ID..."
              />
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-sm font-semibold text-blackKnight hover:bg-gray-50 bg-white">
                Category: All <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-sm font-semibold text-blackKnight hover:bg-gray-50 bg-white">
                Status: All <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 flex flex-col w-full min-w-0">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Pledge ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Donor Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Items Pledged</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {pledges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-text-secondary">
                      No pledges found. Click "Record New Pledge" to add one.
                    </td>
                  </tr>
                ) : (
                  pledges.map((pledge) => (
                    <tr key={pledge.raw_id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-bold text-blackKnight">{pledge.id}</td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="text-sm font-bold text-blackKnight">{pledge.donor}</div>
                        <div className="text-xs text-text-secondary">{pledge.phone} • {pledge.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${pledge.categoryColor} capitalize`}>
                          {pledge.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{pledge.items}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border border-transparent hover:border-gray-300 transition-colors ${pledge.statusColor}`}>
                          {pledge.status}
                        </button>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-bold">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => {
                            setViewingMessage(pledge.message || pledge.notes || 'No message provided.');
                            setIsMessageModalOpen(true);
                          }} className="text-gray-600 hover:text-gray-900 bg-gray-100 p-1.5 rounded-md flex items-center gap-1 text-xs">
                            View
                          </button>
                          <button onClick={() => handleEdit(pledge)} className="text-blue-600 hover:text-blue-800 bg-gray-100 p-1.5 rounded-md flex items-center gap-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => confirmDelete(pledge.raw_id)} className="text-red-600 hover:text-red-800 bg-gray-100 p-1.5 rounded-md flex items-center gap-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Edit Pledge Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editForm.status} 
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-orangeRed1 focus:border-orangeRed1 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing / In Transit</option>
                  <option value="Completed">Completed / Received</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity / Items</label>
                <input 
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({...editForm, quantity: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-orangeRed1 focus:border-orangeRed1 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes & Location</label>
                <textarea 
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-orangeRed1 focus:border-orangeRed1 outline-none resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={saveEdit}
                className="px-4 py-2 bg-orangeRed1 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecordModal && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          <header className="flex h-20 shrink-0 items-center border-b border-border px-8">
            <button onClick={() => setShowRecordModal(false)} className="text-sm font-bold text-text-secondary hover:text-blackKnight mr-4">
              &larr; Back
            </button>
            <h1 className="text-xl font-heading font-bold text-blackKnight">Record New Pledge</h1>
          </header>
          <div className="flex-1 p-8 flex justify-center bg-offWhite">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-border p-8 h-fit">
              <h2 className="text-lg font-bold text-blackKnight mb-6">Donor Information & Pledge Details</h2>
              <form className="space-y-6" onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.target as HTMLFormElement;
                const nameStr = (form.elements.namedItem('donorName') as HTMLInputElement).value;
                const emailStr = (form.elements.namedItem('donorEmail') as HTMLInputElement).value;
                const catStr = (form.elements.namedItem('category') as HTMLSelectElement).value;
                const notesStr = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

                if (!nameStr || !emailStr || !catStr) {
                  alert('Please fill out name, email, and category.');
                  return;
                }

                const [first_name, ...lastParts] = nameStr.split(' ');
                const last_name = lastParts.join(' ');

                const { error } = await supabase.from('donations').insert({
                  first_name,
                  last_name,
                  email: emailStr,
                  donation_type: catStr,
                  notes: notesStr,
                  status: 'Pending',
                  quantity: 1
                });

                if (error) {
                  alert('Failed to save pledge: ' + error.message);
                } else {
                  setShowRecordModal(false);
                  fetchPledges();
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Donor Full Name</label>
                    <input name="donorName" required type="text" placeholder="John Doe" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Donor Email</label>
                    <input name="donorEmail" required type="email" placeholder="john@example.com" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <select name="category" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-white">
                      <option value="">Select Category...</option>
                      <option value="food">Food</option>
                      <option value="medical_supply">Medical</option>
                      <option value="cloth">Clothing</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2">Pledge Note/Description</label>
                    <textarea name="notes" rows={3} placeholder="Describe the pledge..." className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm">
                    Create Pledge Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Confirm Deletion</h3>
              <button onClick={() => setDeletingId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700">Are you sure you want to delete this pledge? This action cannot be undone.</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete Pledge
              </button>
            </div>
          </div>
        </div>
      )}

      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Pledge Message</h3>
              <button onClick={() => setIsMessageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{viewingMessage}</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
