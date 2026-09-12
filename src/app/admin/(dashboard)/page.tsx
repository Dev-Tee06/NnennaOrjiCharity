'use client';

import { Calendar, Gift, Package, Shirt, DollarSign, CheckCircle2, Truck, Clock, Search, Bell, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPledges: 0,
    totalValue: 0,
    foodCount: 0,
    clothCount: 0,
    medicalCount: 0,
    cashCount: 0,
    collected: 0,
    inProgress: 0,
    pending: 0,
  });
  
  const [recentDonors, setRecentDonors] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [adminName, setAdminName] = useState('Admin');
  
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAdminName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin');
      }
    });

    fetchData();
    
    const donationsSub = supabase.channel('dash-donations').on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchData).subscribe();
    const requestsSub = supabase.channel('dash-requests').on('postgres_changes', { event: '*', schema: 'public', table: 'company_requests' }, fetchData).subscribe();
    
    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(requestsSub);
    };
  }, []);

  const fetchData = async () => {
    // Fetch pledges
    const { data: dData } = await supabase.from('donations').select('*, donors(first_name, last_name)').order('created_at', { ascending: false });
    
    // Fetch requests
    const { data: rData } = await supabase.from('company_requests').select('*').order('created_at', { ascending: false }).limit(5);
    
    if (dData) {
      const food = dData.filter(d => d.donation_type === 'food').length;
      const cloth = dData.filter(d => d.donation_type === 'cloth').length;
      const medical = dData.filter(d => d.donation_type === 'medical_supply').length;
      const cash = dData.filter(d => d.donation_type === 'cash').length;
      
      const collected = dData.filter(d => d.status === 'Handed Over' || d.status === 'Resolved').length;
      const inProgress = dData.filter(d => d.status === 'In Transit').length;
      const pending = dData.filter(d => d.status === 'Pending').length;
      
      const totalValue = dData.filter(d => d.donation_type === 'cash').reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
      
      setStats({
        totalPledges: dData.length,
        totalValue,
        foodCount: food,
        clothCount: cloth,
        medicalCount: medical,
        cashCount: cash,
        collected,
        inProgress,
        pending
      });
      
      setRecentDonors(dData.slice(0, 5));
    }
    
    if (rData) {
      setRecentRequests(rData);
    }
  };

  const getPercent = (count: number) => {
    if (stats.totalPledges === 0) return 0;
    return Math.round((count / stats.totalPledges) * 100);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      <TopHeader title="Dashboard Overview" />
      <MobilePageTitle title="Dashboard Overview" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="space-y-6 max-w-[1200px] mx-auto pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            <div>
              <h2 className="text-2xl font-heading font-bold text-blackKnight">Welcome Back, {adminName}</h2>
              <p className="text-sm text-text-secondary mt-1">System operations running stable. Here is today's charity fulfillment matrix.</p>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-border rounded-md px-4 py-2 text-sm font-medium text-blackKnight shadow-sm hover:bg-gray-50">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="hidden sm:inline">Dec 1, 2026 - Dec 31, 2026</span>
              <span className="sm:hidden">Dec 2026</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-text-secondary tracking-wider">TOTAL PLEDGES</span>
                <Gift className="h-4 w-4 text-orangeRed1" />
              </div>
              <div className="text-4xl font-heading font-bold text-orangeRed1 mb-2">{stats.totalPledges}</div>
              <div className="text-sm font-medium text-blackKnight">Value: ₦{stats.totalValue.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-text-secondary tracking-wider">FOOD DONATIONS</span>
                <Package className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-4xl font-heading font-bold text-blackKnight mb-2">{stats.foodCount}</div>
              <div className="text-sm font-medium text-text-secondary">Bags & provisions units</div>
            </div>
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-text-secondary tracking-wider">CLOTHING DONATIONS</span>
                <Shirt className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-4xl font-heading font-bold text-blackKnight mb-2">{stats.clothCount}</div>
              <div className="text-sm font-medium text-text-secondary">Cartons processed</div>
            </div>
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-text-secondary tracking-wider">MEDICAL & CASH</span>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-4xl font-heading font-bold text-blackKnight mb-2">{stats.medicalCount + stats.cashCount}</div>
              <div className="text-sm font-medium text-text-secondary">Special requests processed</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-heading font-bold text-blackKnight mb-6">Category Distribution</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2 text-blackKnight">
                    <span>Food Materials ({getPercent(stats.foodCount)}%)</span>
                    <span className="text-text-secondary">{stats.foodCount} Pledges</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orangeRed1 h-2 rounded-full transition-all duration-500" style={{ width: `${getPercent(stats.foodCount)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2 text-blackKnight">
                    <span>Clothing & Garments ({getPercent(stats.clothCount)}%)</span>
                    <span className="text-text-secondary">{stats.clothCount} Pledges</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-slate-700 h-2 rounded-full transition-all duration-500" style={{ width: `${getPercent(stats.clothCount)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2 text-blackKnight">
                    <span>Medical Supplies ({getPercent(stats.medicalCount)}%)</span>
                    <span className="text-text-secondary">{stats.medicalCount} Pledges</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-slate-700 h-2 rounded-full transition-all duration-500" style={{ width: `${getPercent(stats.medicalCount)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2 text-blackKnight">
                    <span>Cash Support ({getPercent(stats.cashCount)}%)</span>
                    <span className="text-text-secondary">{stats.cashCount} Pledges</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full transition-all duration-500" style={{ width: `${getPercent(stats.cashCount)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-bold text-blackKnight mb-6">Fulfillment Progress</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blackKnight">Collected & Handed Over</div>
                    <div className="text-xs text-text-secondary">{getPercent(stats.collected)}% of total volume</div>
                  </div>
                  <div className="text-lg font-bold text-green-700">{stats.collected}</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blackKnight">In Progress / Transit</div>
                    <div className="text-xs text-text-secondary">{getPercent(stats.inProgress)}% of total volume</div>
                  </div>
                  <div className="text-lg font-bold text-blue-700">{stats.inProgress}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blackKnight">Pending Pick-up</div>
                    <div className="text-xs text-text-secondary">{getPercent(stats.pending)}% of total volume</div>
                  </div>
                  <div className="text-lg font-bold text-orange-600">{stats.pending}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border shadow-sm p-0 overflow-hidden flex flex-col min-h-[300px]">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-heading font-bold text-blackKnight">Latest Donors</h3>
                <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-xs font-semibold text-blackKnight hover:bg-gray-50">
                  <Calendar className="h-3 w-3" />
                  Today
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {recentDonors.length === 0 ? (
                  <div className="flex items-center justify-center h-full p-8 text-center text-text-secondary text-sm">
                    No recent donors to display.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recentDonors.map((d) => (
                      <div key={d.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-blackKnight">{d.donors?.first_name || 'Anonymous'} {d.donors?.last_name || ''}</span>
                          <span className="text-xs text-text-secondary capitalize">{d.donation_type}</span>
                        </div>
                        <span className="text-xs font-bold text-orangeRed1">{new Date(d.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border shadow-sm p-0 overflow-hidden flex flex-col min-h-[300px]">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-heading font-bold text-blackKnight">Partnership Inquiries</h3>
                <a href="/admin/requests" className="text-sm font-bold text-orangeRed1 hover:text-orange-700">Review Actions</a>
              </div>
              <div className="flex-1 overflow-y-auto">
                {recentRequests.length === 0 ? (
                  <div className="flex items-center justify-center h-full p-8 text-center text-text-secondary text-sm">
                    No active partnership inquiries.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recentRequests.map((r) => (
                      <div key={r.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-blackKnight">{r.company_name}</span>
                          <span className="text-xs text-text-secondary truncate max-w-[200px]">{r.subject}</span>
                        </div>
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{r.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
