'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Download, ChevronDown, Bell } from 'lucide-react';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
export default function PartnershipInquiriesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchInquiries();
    const channel = supabase
      .channel('requests-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_requests' }, fetchInquiries)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchInquiries = async () => {
    const { data } = await supabase.from('company_requests').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map((r: any) => ({
        id: r.id,
        org: r.company_name || 'N/A',
        contact: r.contact_name || 'N/A',
        email: r.email || 'N/A',
        phone: r.phone || 'N/A',
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: r.status || 'New',
        statusColor: r.status === 'Resolved' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
      }));
      setInquiries(formatted);
    }
  };

  const handleDownload = () => {
    alert('Downloading report...');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      {/* Page Header integrated into page */}
      <TopHeader title="Corporate & Strategic Partnership Inquiries" />
      <MobilePageTitle title="Corporate & Strategic Partnership Inquiries" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] w-full min-w-0">
          
          <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex bg-gray-100/80 p-1 rounded-lg">
              <button 
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'all' ? 'bg-white shadow-sm text-blackKnight' : 'text-gray-500 hover:text-blackKnight'}`}
                onClick={() => setActiveTab('all')}
              >
                All Inquiries (0)
              </button>
              <button 
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'pending' ? 'bg-white shadow-sm text-blackKnight' : 'text-gray-500 hover:text-blackKnight'}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Responses (0)
              </button>
            </div>
            
            <button 
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-blackKnight hover:text-orangeRed1 mt-4 sm:mt-0 bg-white border border-border sm:border-0 rounded-md p-2 sm:p-0 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>

          <div className="overflow-x-auto flex-1 flex flex-col w-full min-w-0">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Organisation Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Primary Contact</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Phone Number</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Date Logged</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-text-secondary">
                      No partnership inquiries found.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-bold text-blackKnight">{inquiry.org}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-blackKnight">{inquiry.contact}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{inquiry.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{inquiry.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{inquiry.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${inquiry.statusColor}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-bold">
                        <button className="text-orangeRed1 hover:text-orange-700">View Inquiry</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
