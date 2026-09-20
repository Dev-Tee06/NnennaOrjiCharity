'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, Edit, Trash2, X } from 'lucide-react';

type Donation = {
  id: string;
  donation_type: string;
  quantity: number;
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string;
  message: string;
  donors: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};

export function DonationsTable({ filterType }: { filterType?: 'food' | 'cloth' | 'medical_supply' }) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState('');
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    quantity: 1,
    notes: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchDonations();
    
    const channel = supabase
      .channel('donations-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchDonations)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterType]);

  const fetchDonations = async () => {
    setIsLoading(true);
    let query = supabase.from('donations').select(`
      id,
      donation_type,
      quantity,
      status,
      created_at,
      first_name,
      last_name,
      email,
      phone,
      notes,
      message,
      donors (
        first_name,
        last_name,
        email,
        phone
      )
    `).order('created_at', { ascending: false });

    if (filterType) {
      query = query.eq('donation_type', filterType);
    }

    const { data, error } = await query;
    if (!error && data) {
      setDonations(data as any);
    }
    setIsLoading(false);
  };

  const filteredDonations = donations.filter((d) => {
    const fName = d.first_name || d.donors?.first_name || '';
    const lName = d.last_name || d.donors?.last_name || '';
    const email = d.email || d.donors?.email || '';
    const phone = d.phone || d.donors?.phone || '';
    
    const fullName = `${fName} ${lName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.toLowerCase().includes(searchLower) ||
           phone.includes(searchLower);
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Handed Over': return 'bg-green-100 text-green-800';
      case 'Received': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setEditForm({
      status: donation.status || 'Pending',
      quantity: donation.quantity || 1,
      notes: donation.notes || ''
    });
    setIsModalOpen(true);
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
      fetchDonations();
    }
  };

  const saveEdit = async () => {
    if (!editingDonation) return;
    
    const { error } = await supabase
      .from('donations')
      .update({
        status: editForm.status,
        quantity: editForm.quantity,
        notes: editForm.notes
      })
      .eq('id', editingDonation.id);
      
    if (error) {
      alert('Failed to update: ' + error.message);
    } else {
      setIsModalOpen(false);
      setEditingDonation(null);
      fetchDonations();
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-border overflow-hidden relative">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search donors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orangeRed1 focus:border-orangeRed1 sm:text-sm transition duration-150 ease-in-out"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-blackKnight hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
              {!filterType && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">Loading...</td>
              </tr>
            ) : filteredDonations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">No donations found.</td>
              </tr>
            ) : (
              filteredDonations.map((donation) => {
                const fName = donation.first_name || donation.donors?.first_name || 'Anonymous';
                const lName = donation.last_name || donation.donors?.last_name || '';
                const email = donation.email || donation.donors?.email || '';
                const phone = donation.phone || donation.donors?.phone || '';
                
                return (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(donation.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {`${fName} ${lName}`}
                    </td>
                    {!filterType && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${
                          donation.donation_type === 'food' ? 'text-orange-600 bg-orange-50' :
                          donation.donation_type === 'cloth' ? 'text-blue-600 bg-blue-50' :
                          donation.donation_type === 'medical_supply' ? 'text-red-600 bg-red-50' :
                          'text-gray-600 bg-gray-50'
                        }`}>
                          {donation.donation_type === 'food' ? 'Food Donation' : 
                           donation.donation_type === 'cloth' ? 'Clothing Donation' : 
                           donation.donation_type === 'medical_supply' ? 'Medical Supplies' : 'Uncategorized'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{email}</span>
                        <span className="text-xs text-gray-400">{phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => {
                          setViewingMessage(donation.message || donation.notes || 'No message provided.');
                          setIsMessageModalOpen(true);
                        }} className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                          View
                        </button>
                        <button onClick={() => handleEdit(donation)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <Edit size={16} /> Edit
                        </button>
                        <button onClick={() => confirmDelete(donation.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Edit Pledge</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({...editForm, quantity: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-orangeRed1 focus:border-orangeRed1 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Location Details</label>
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
                onClick={() => setIsModalOpen(false)}
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
