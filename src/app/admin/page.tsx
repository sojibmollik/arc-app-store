import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, Inbox, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { getAdminStats } from '@/lib/actions/admin';
import { AdminLogin } from '@/components/AdminLogin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Route 1: Logged Out -> Render Login Page
  if (!user) {
    return <AdminLogin />;
  }

  // Route 2: Logged In -> Fetch metrics and render Dashboard
  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <section className="flex flex-col gap-2 border-b border-brand-border/40 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-brand-cyan" /> Admin Dashboard
        </h1>
        <p className="text-slate-400 text-sm">
          Welcome to the Arc App Store control center. Monitor submissions and update ecosystem directory states.
        </p>
      </section>

      {/* Metrics Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Approved Apps Stat */}
        <Card className="border border-brand-border/60 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)] transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Approved Apps</span>
              <h3 className="text-3xl font-extrabold text-white">{stats.totalApps}</h3>
            </div>
            <div className="p-3 rounded-lg bg-brand-violet/10 text-brand-violet border border-brand-violet/20">
              <FolderKanban className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Submissions Stat */}
        <Card className="border border-brand-border/60 hover:shadow-[0_0_15px_rgba(255,0,127,0.15)] transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Pending Review</span>
              <h3 className="text-3xl font-extrabold text-brand-pink">{stats.pendingSubmissions}</h3>
            </div>
            <div className="p-3 rounded-lg bg-brand-pink/10 text-brand-pink border border-brand-pink/20">
              <Inbox className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Total Applications Processed */}
        <Card className="border border-brand-border/60 hover:shadow-[0_0_15px_rgba(0,242,254,0.15)] transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Approved Submissions</span>
              <h3 className="text-3xl font-extrabold text-brand-cyan">{stats.approvedSubmissions}</h3>
            </div>
            <div className="p-3 rounded-lg bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <Card className="flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-violet/10 text-brand-violet">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Manage App Directory</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              List all published apps, edit their features, toggle ecosystem featured status, or remove old submissions from the active directory.
            </p>
          </CardContent>
          <div className="px-6 py-4 bg-brand-dark/20 border-t border-brand-border/40">
            <Link href="/admin/apps">
              <Button variant="glass" size="sm" className="w-full" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                Manage Apps
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-pink/10 text-brand-pink">
                <Inbox className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Review Submissions</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Check incoming developer forms. Preview submitted app logos and screenshots. Approve or reject requests with a single click.
            </p>
          </CardContent>
          <div className="px-6 py-4 bg-brand-dark/20 border-t border-brand-border/40">
            <Link href="/admin/pending">
              <Button variant="glass" size="sm" className="w-full" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                Review Submissions
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
