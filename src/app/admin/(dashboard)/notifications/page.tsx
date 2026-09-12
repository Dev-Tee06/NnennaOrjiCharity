'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
export default function NotificationsCenterPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]); // Empty data for realtime updates

  const handleMarkAllRead = () => {
    // Basic interaction feedback
    alert('All notifications marked as read.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      {/* Page Header */}
      <TopHeader title="Notifications Center" />
      <MobilePageTitle title="Notifications Center" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] w-full min-w-0">
          
          <div className="p-4 border-b border-border flex justify-between items-center">
            <div className="flex bg-gray-100/80 p-1 rounded-lg">
              {['All Notifications', 'Pledges', 'Partnerships', 'System'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === tab.toLowerCase() ? 'bg-orangeRed1 text-white shadow-sm' : 'text-gray-500 hover:text-blackKnight'}`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
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
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-sm text-text-secondary flex-1 flex flex-col items-center justify-center">
                <Bell className="h-8 w-8 text-gray-300 mb-3" />
                No new notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-5 flex items-start justify-between border-b border-border hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                      {notif.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blackKnight flex items-center gap-2">
                        {notif.unread && <span className="h-1.5 w-1.5 rounded-full bg-orangeRed1" />}
                        {notif.title}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">{notif.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold text-text-secondary">{notif.time}</span>
                    <button className="text-xs font-bold text-blackKnight hover:text-orangeRed1 bg-gray-100 px-3 py-1.5 rounded-md">
                      {notif.action}
                    </button>
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
