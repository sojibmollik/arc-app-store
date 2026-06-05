import React from 'react';
import { Compass } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { AppGrid } from '@/components/AppGrid';

export const dynamic = 'force-dynamic';

interface AppsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AppsPage({ searchParams }: AppsPageProps) {
  let apps = [];
  const params = await searchParams;
  const initialCategory = params.category || 'All';

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('apps')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (data) {
      apps = data;
    }
  } catch (error) {
    console.error('Failed to fetch apps for directory:', error);
  }

  return (
    <div className="flex flex-col gap-10 py-8 relative">
      {/* Header section */}
      <section className="flex flex-col gap-3 max-w-xl">
        <div className="inline-flex items-center gap-1 text-brand-cyan text-xs font-semibold uppercase tracking-wider">
          <Compass className="h-4 w-4" />
          Ecosystem Directory
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Explore Arc Applications
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Filter through decentralized protocols, web3 applications, developer wallets, and community platforms built inside the Arc ecosystem.
        </p>
      </section>

      {/* Grid containing app items */}
      <section className="w-full">
        <AppGrid apps={apps} initialCategory={initialCategory} />
      </section>
    </div>
  );
}
