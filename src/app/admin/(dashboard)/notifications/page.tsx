'use client';

import { Bell, CheckCircle, Info, AlertTriangle, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';

export default function NotificationsCenterPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();

    const channel = supabase.channel('notifications-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase.from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (activeTab !== 'All') {
      const typeMap: Record<string, string[]> = {
        'Pledges': ['PledgeAssignment', 'AssignmentFailure', 'ReviewNeeded'],
        'Admin Activity': ['AdminManagement', 'UPDATE_PERMISSIONS', 'AuditAlert', 'AuditLog'],
        'Requests': ['System', 'Request'], // Captures both old 'System' and new 'Request' types
        'System': ['System']
      };
      const types = typeMap[activeTab];
      if (types) query = query.in('type', types);
    }

    const { data: notifData } = await query;
    let allItems: any[] = notifData || [];

    // Also fetch the true audit logs if 'All' or 'Admin Activity' is selected
    if (activeTab === 'All' || activeTab === 'Admin Activity') {
      const { data: auditLogs } = await supabase
        .from('admin_activity_logs')
        .select('id, action, resource, details, created_at, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (auditLogs) {
        const formattedAudit = auditLogs.map((log: any) => {
          let message = `${log.profiles?.full_name || 'Admin'} (${log.profiles?.email || 'Unknown'}) performed: ${log.action} on ${log.resource}. Details: ${log.details?.action_title || JSON.stringify(log.details)}`;
          
          if (log.action === 'INVITE_ADMIN') {
            message = `${log.profiles?.email || 'An Admin'} created an account for ${log.details?.email || 'a new user'}`;
          }

          return {
            id: `audit-${log.id}`,
            type: 'AuditLog',
            title: 'System Audit Log',
            message: message,
            created_at: log.created_at,
            read_status: true, // Audit logs don't have a read status for individual users
            link_url: null,
            is_audit: true
          };
        });
        
        allItems = [...allItems, ...formattedAudit];
      }
    }

    // Sort combined items by date descending
    allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setNotifications(allItems);
    setLoading(false);
  };

  const handleMarkAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('notifications')
      .update({ read_status: true })
      .eq('user_id', user.id)
      .eq('read_status', false);
      
    fetchNotifications();
  };

  const handleMarkRead = async (id: number) => {
    await supabase.from('notifications').update({ read_status: true }).eq('id', id);
    fetchNotifications();
  };

  const handleNavigate = (notif: any) => {
    if (!notif.read_status) handleMarkRead(notif.id);
    if (notif.link_url) router.push(notif.link_url);
  };

  const getIcon = (type: string) => {
    if (type.includes('Pledge')) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (type.includes('Admin') || type === 'UPDATE_PERMISSIONS' || type === 'AuditAlert' || type === 'AuditLog') return <Shield className="h-5 w-5 text-blue-600" />;
    if (type.includes('Failure') || type === 'ReviewNeeded') return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (type === 'Request' || type === 'System') return <Info className="h-5 w-5 text-purple-600" />;
    return <Info className="h-5 w-5 text-gray-600" />;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      <TopHeader title="Notifications Center" />
      <MobilePageTitle title="Notifications Center" />

      <div className="flex-1 overflow-y-auto p-4 md:p-4">
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] w-full min-w-0">
          
          <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap bg-gray-100/80 p-1 rounded-lg">
              {['All', 'Pledges', 'Requests', 'Admin Activity', 'System'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-orangeRed1 text-white shadow-sm' : 'text-gray-500 hover:text-blackKnight'}`}
                  onClick={() => { setLoading(true); setActiveTab(tab); }}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleMarkAllRead}
              className="text-sm font-bold text-blackKnight hover:text-orangeRed1 transition-colors"
            >
              Mark All as Read
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-sm text-text-secondary flex-1 flex flex-col items-center justify-center">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-sm text-text-secondary flex-1 flex flex-col items-center justify-center">
                <Bell className="h-8 w-8 text-gray-300 mb-3" />
                No {activeTab.toLowerCase()} notifications found.
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-5 flex items-start justify-between border-b border-border hover:bg-gray-50 transition-colors ${!notif.read_status ? 'bg-blue-50/20' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
                      {getIcon(notif.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blackKnight flex items-center gap-2">
                        {!notif.read_status && <span className="h-2 w-2 rounded-full bg-orangeRed1" />}
                        {notif.title}
                        {notif.is_audit && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider font-bold ml-2">
                            Audit Record
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {notif.link_url && (
                      <button 
                        onClick={() => handleNavigate(notif)}
                        className="text-xs font-bold text-blackKnight hover:text-orangeRed1 bg-gray-100 px-3 py-1.5 rounded-md"
                      >
                        View Details
                      </button>
                    )}
                    {!notif.read_status && (
                       <button 
                        onClick={() => handleMarkRead(notif.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            
            <div className="p-6 text-center text-xs font-semibold text-text-secondary bg-gray-50/50 border-t border-border mt-auto">
              Only displaying up to past 30 days. Older notifications are archived for compliance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
