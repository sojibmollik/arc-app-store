import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, Inbox, LogOut, ArrowLeft, Cpu } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { logoutAdmin } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not authenticated, render login page directly (passed as children in admin/page.tsx)
  if (!user) {
    return <div className="w-full flex-1 flex flex-col justify-center">{children}</div>;
  }

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row gap-8 py-4 relative z-10">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="glass-panel rounded-2xl p-6 border border-brand-border/60 sticky top-24 flex flex-col justify-between min-h-[300px] lg:min-h-[500px]">
          <div className="space-y-6">
            {/* Logo & Subtitle */}
            <div className="border-b border-brand-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="relative h-7 w-7 rounded-lg overflow-hidden border border-brand-border/60">
                  <img 
                    src="/logo.jpg" 
                    alt="Arc Logo" 
                    className="object-cover h-full w-full"
                  />
                </div>
                <span className="text-sm font-bold text-white tracking-wider">
                  ARC ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1 uppercase tracking-wide">
                Management Terminal
              </span>
            </div>

            {/* Sidebar Links */}
            <nav className="flex flex-col gap-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4 text-brand-cyan" />
                Dashboard Overview
              </Link>
              
              <Link
                href="/admin/apps"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <FolderKanban className="h-4 w-4 text-brand-violet" />
                Manage Apps
              </Link>

              <Link
                href="/admin/pending"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <Inbox className="h-4 w-4 text-brand-pink" />
                Pending Review
              </Link>
            </nav>
          </div>

          {/* Logout & Back to Store Actions */}
          <div className="border-t border-brand-border/40 pt-4 flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white px-4 py-2 transition-colors duration-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Exit to App Store
            </Link>

            <form action={logoutAdmin} className="w-full">
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-brand-pink/80 hover:text-brand-pink hover:bg-brand-pink/5 rounded-lg border border-transparent hover:border-brand-pink/15 transition-all duration-200 text-left cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Terminate Session
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Pages (apps, pending, dashboard) */}
      <section className="flex-1 min-w-0">
        {children}
      </section>
    </div>
  );
}
