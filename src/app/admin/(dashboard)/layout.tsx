import { Sidebar } from '@/components/dashboard/Sidebar';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
