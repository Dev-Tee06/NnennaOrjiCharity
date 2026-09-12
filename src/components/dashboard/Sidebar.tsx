'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Heart, Users, Shield, Settings, LayoutGrid } from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard Overview', href: '/admin', icon: LayoutGrid },
  { name: 'Pledges & Donations', href: '/admin/donations', icon: Heart },
  { name: 'Partnership Inquiries', href: '/admin/requests', icon: Users },
  { name: 'Admin & Role Management', href: '/admin/roles', icon: Shield },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 flex-col border-r border-border bg-white shrink-0">
        <div className="flex h-20 shrink-0 flex-col justify-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 flex-shrink-0">
              <div className="w-10 h-10 bg-orangeRed1 flex items-center justify-center rounded-md font-bold text-white text-xl">
                N
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-[15px] leading-tight text-blackKnight">NnennaOrjiCharity</span>
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Foundation</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
          <nav className="flex-1 space-y-2 px-4" aria-label="Sidebar">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-orangeRed1 text-white shadow-sm'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-blackKnight'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-text-secondary group-hover:text-blackKnight'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 px-2 pb-safe pt-1">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full px-1 ${
                  isActive ? 'text-orangeRed1' : 'text-text-secondary'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] text-center font-medium truncate w-full px-1">{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
