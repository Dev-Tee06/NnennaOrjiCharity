'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Download, ChevronDown, Bell, X, Trash2 } from 'lucide-react';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';

export default function PartnershipInquiriesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [viewingInquiry, setViewingInquiry] = useState<any>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchInquiries();
    const channel1 = supabase
      .channel('partnerships-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partnerships' }, fetchInquiries)
      .subscribe();
    const channel2 = supabase
      .channel('enquiries-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_enquiries' }, fetchInquiries)
      .subscribe();
    const channel3 = supabase
      .channel('company-requests-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_requests' }, fetchInquiries)
      .subscribe();
      
    return () => { 
      supabase.removeChannel(channel1); 
      supabase.removeChannel(channel2); 
      supabase.removeChannel(channel3);
    };
  }, []);

  const fetchInquiries = async () => {
    // Fetch from all related PRD tables
    const [partnershipsRes, enquiriesRes, requestsRes] = await Promise.all([
      supabase.from('partnerships').select('*'),
      supabase.from('company_enquiries').select('*'),
      supabase.from('company_requests').select('*')
    ]);

    const partnerships = (partnershipsRes.data || []).map(d => ({...d, sourceTable: 'partnerships'}));
    const enquiries = (enquiriesRes.data || []).map(d => ({...d, sourceTable: 'company_enquiries'}));
    const requests = (requestsRes.data || []).map(d => ({...d, sourceTable: 'company_requests'}));

    const allData = [...partnerships, ...enquiries, ...requests].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const formatted = allData.map((r: any) => ({
      raw: r,
      id: r.id,
      sourceTable: r.sourceTable,
      org: r.organisation || r.company_name || 'N/A',
      contact: r.contact_name ? r.contact_name : `${r.first_name || ''} ${r.last_name || ''}`.trim() || 'N/A',
      email: r.email || 'N/A',
      phone: r.phone || 'N/A',
      subject: r.subject || 'N/A',
      message: r.message || 'No message provided',
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: r.status || 'New',
      statusColor: r.status === 'Resolved' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
    }));
    
    setInquiries(formatted);
  };

  const handleDownload = () => {
    alert('Downloading report...');
  };

  const [deletingInquiry, setDeletingInquiry] = useState<{id: string, sourceTable: string} | null>(null);

  const confirmDelete = (id: string, sourceTable: string) => {
    setDeletingInquiry({ id, sourceTable });
  };

  const handleDelete = async () => {
    if (!deletingInquiry) return;
    const { error } = await supabase.from(deletingInquiry.sourceTable).delete().eq('id', deletingInquiry.id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      fetchInquiries();
      if (viewingInquiry?.id === deletingInquiry.id) {
        setViewingInquiry(null);
      }
      setDeletingInquiry(null);
    }
  };

  const filteredInquiries = activeTab === 'pending' ? inquiries.filter(i => i.status !== 'Resolved') : inquiries;

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full relative">
      <TopHeader title="Corporate & Strategic Partnership Inquiries" />
      <MobilePageTitle title="Corporate & Strategic Partnership Inquiries" />

      <div className="flex-1 overflow-y-auto p-4 md:p-4">
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] w-full min-w-0">
          
          <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex bg-gray-100/80 p-1 rounded-lg">
              <button 
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'all' ? 'bg-white shadow-sm text-blackKnight' : 'text-gray-500 hover:text-blackKnight'}`}
                onClick={() => setActiveTab('all')}
              >
                All Inquiries ({inquiries.length})
              </button>
              <button 
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'pending' ? 'bg-white shadow-sm text-blackKnight' : 'text-gray-500 hover:text-blackKnight'}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Responses ({inquiries.filter(i => i.status !== 'Resolved').length})
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
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-text-secondary">
                      No partnership inquiries found.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
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
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setViewingInquiry(inquiry)} className="text-orangeRed1 hover:text-orange-700">View</button>
                          <button onClick={() => confirmDelete(inquiry.id, inquiry.sourceTable)} className="text-red-500 hover:text-red-700">Delete</button>
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

      {viewingInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-blackKnight">Inquiry Details</h3>
              <button onClick={() => setViewingInquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Organisation / Company</h4>
                  <p className="text-sm font-semibold text-blackKnight">{viewingInquiry.org}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Date Logged</h4>
                  <p className="text-sm font-semibold text-blackKnight">{viewingInquiry.date}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Contact Name</h4>
                  <p className="text-sm font-semibold text-blackKnight">{viewingInquiry.contact}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Status</h4>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${viewingInquiry.statusColor}`}>
                    {viewingInquiry.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Email</h4>
                  <p className="text-sm font-semibold text-blackKnight">{viewingInquiry.email}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Phone Number</h4>
                  <p className="text-sm font-semibold text-blackKnight">{viewingInquiry.phone}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Subject</h4>
                <p className="text-sm font-bold text-blackKnight">{viewingInquiry.subject}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Message Content</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-blackKnight whitespace-pre-wrap leading-relaxed">
                    {viewingInquiry.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-between gap-3 bg-gray-50 mt-auto">
              <button 
                onClick={() => confirmDelete(viewingInquiry.id, viewingInquiry.sourceTable)}
                className="px-4 py-2 flex items-center gap-2 border border-red-200 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} /> Delete Inquiry
              </button>
              <button 
                onClick={() => setViewingInquiry(null)}
                className="px-6 py-2 bg-blackKnight text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Confirm Deletion</h3>
              <button onClick={() => setDeletingInquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700">Are you sure you want to permanently delete this inquiry? This action cannot be undone.</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button 
                onClick={() => setDeletingInquiry(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
