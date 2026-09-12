'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, Eye } from 'lucide-react';

type Donation = {
  id: string;
  donation_type: string;
  quantity: number;
  status: string;
  created_at: string;
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
    const fullName = `${d.donors?.first_name || ''} ${d.donors?.last_name || ''}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || 
           (d.donors?.email || '').toLowerCase().includes(searchLower) ||
           (d.donors?.phone || '').includes(searchLower);
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-border overflow-hidden">
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
              filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(donation.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`${donation.donors?.first_name || ''} ${donation.donors?.last_name || ''}`}
                  </td>
                  {!filterType && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {donation.donation_type.replace('_', ' ')}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{donation.donors?.email}</span>
                      <span className="text-xs text-gray-400">{donation.donors?.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orangeRed1 hover:text-orangeRed1/80 flex items-center justify-end gap-1 w-full">
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
