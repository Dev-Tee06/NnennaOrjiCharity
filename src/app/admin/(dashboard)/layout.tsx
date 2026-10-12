import { Sidebar } from '@/components/dashboard/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, onboarding_status')
    .eq('id', user.id)
    .single();

  if (profile) {
    if (profile.status === 'Suspended' || profile.status === 'Revoked') {
      redirect('/admin/login?error=account_suspended');
    }
    if (profile.onboarding_status === 'Pending Setup') {
      redirect('/admin/onboarding');
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-offWhite overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative min-w-0 w-full">
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-offWhite pb-16 lg:pb-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

