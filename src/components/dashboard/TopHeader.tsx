'use client';

import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function TopHeader({ title }: { title: string }) {
  const [user, setUser] = useState<{name: string, initial: string} | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
        setUser({
          name: name,
          initial: name.charAt(0).toUpperCase()
        });
      } else {
        setUser({ name: 'Admin', initial: 'A' });
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <header className="flex h-16 md:h-20 shrink-0 items-center justify-between border-b border-border bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Mobile Logo (visible only on mobile) */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 bg-orangeRed1 flex items-center justify-center rounded-md font-bold text-white text-lg">
          N
        </div>
      </div>

      {/* Desktop Title (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-center">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
          NOCF / ADMIN PORTAL
        </span>
        <h1 className="text-xl font-heading font-bold text-blackKnight">{title}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-x-3 md:gap-x-6 ml-auto relative" ref={dropdownRef}>
        <div className="relative hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full md:w-64 lg:w-[300px] rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orangeRed1 sm:text-sm sm:leading-6 bg-gray-50/50"
            placeholder="Search..."
          />
        </div>

        <button type="button" className="relative p-2 text-gray-600 hover:text-blackKnight rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div 
          className="flex items-center gap-2 cursor-pointer rounded-full border border-gray-200 p-1.5 md:pr-3 hover:bg-gray-50 transition-colors"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="h-7 w-7 rounded-full bg-blackKnight flex items-center justify-center text-white text-xs font-bold">
            {user?.initial || 'A'}
          </div>
          <span className="text-sm font-bold text-blackKnight hidden sm:block">
            {user?.name || 'Admin'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block ml-1" />
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 top-14 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 border border-border">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
