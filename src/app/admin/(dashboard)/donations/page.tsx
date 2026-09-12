'use client';

import { Search, ChevronDown, Bell, Filter, MoreHorizontal, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
export default function PledgesDonationsPage() {
  const [pledges, setPledges] = useState<any[]>([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
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
    
    if (data) {
      const formatted = data.map((d: any) => ({
        id: `PLG-${d.id.substring(0,4)}`,
        donor: `${d.donors?.first_name || ''} ${d.donors?.last_name || ''}`,
        email: d.donors?.email || '',
        phone: d.donors?.phone || '',
        category: d.donation_type,
        categoryColor: 'text-green-600 bg-green-50',
        items: `${d.quantity || 1} items`,
        status: d.status || 'Pending',
        statusColor: d.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
      }));
      setPledges(formatted);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full relative">
      {/* Page Header */}
      <TopHeader title="Pledges & Donations" />
      <MobilePageTitle title="Pledges & Donations" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 w-full w-full">
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
                {pledges.filter(p => p.status === 'Completed' || p.status === 'Handed Over' || p.status === 'Resolved').length}
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
              <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-sm font-semibold text-blackKnight hover:bg-gray-50 bg-white">
                Location: All <ChevronDown className="h-4 w-4 text-gray-400" />
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
                    <tr key={pledge.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-bold text-blackKnight">{pledge.id}</td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="text-sm font-bold text-blackKnight">{pledge.donor}</div>
                        <div className="text-xs text-text-secondary">{pledge.phone} • {pledge.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${pledge.categoryColor}`}>
                          {pledge.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{pledge.items}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border border-transparent hover:border-gray-300 transition-colors ${pledge.statusColor}`}>
                          {pledge.status} <ChevronDown className="h-3 w-3 ml-1" />
                        </button>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-bold">
                        <button className="text-gray-400 hover:text-blackKnight bg-gray-100 p-1.5 rounded-md">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowRecordModal(false); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Select Donor from Database</label>
                    <input type="text" placeholder="Search name or phone..." className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-white">
                      <option>Select Category...</option>
                      <option>Food</option>
                      <option>Medical</option>
                      <option>Clothing</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2">Pledge Note/Description</label>
                    <textarea rows={3} placeholder="Describe the pledge..." className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-orangeRed1 focus:border-orangeRed1" />
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
    </div>
  );
}
