'use client';

export function MobilePageTitle({ title }: { title: string }) {
  return (
    <div className="md:hidden bg-white border border-border rounded-lg shadow-sm m-4 p-4 mb-2">
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">
        NOCF / ADMIN PORTAL
      </span>
      <h1 className="text-xl font-heading font-bold text-blackKnight">{title}</h1>
    </div>
  );
}
