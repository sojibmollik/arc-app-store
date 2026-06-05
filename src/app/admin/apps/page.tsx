import React from 'react';
import { redirect } from 'next/navigation';
import { FolderKanban } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { ManageAppsTable } from '@/components/ManageAppsTable';

export const dynamic = 'force-dynamic';

export default async function ManageAppsPage() {
  const supabase = await createClient();
  
  // 1. Auth Guard - redirect if not logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin');
  }

  // 2. Fetch approved apps list
  let apps = [];
  try {
    const { data } = await supabase
      .from('apps')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) {
      apps = data;
    }
  } catch (err) {
    console.error('Failed to load apps for admin panel:', err);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <section className="flex flex-col gap-2 border-b border-brand-border/40 pb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-brand-violet" /> Manage Applications
        </h1>
        <p className="text-slate-400 text-sm">
          Edit metadata, update featured flags, and delete published apps in real-time.
        </p>
      </section>

      {/* Directory Manager Table */}
      <section className="w-full">
        <ManageAppsTable apps={apps} />
      </section>
    </div>
  );
}
