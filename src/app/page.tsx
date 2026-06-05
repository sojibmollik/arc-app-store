import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, ArrowRight, UploadCloud } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { AppGrid } from '@/components/AppGrid';
import { Button } from '@/components/ui/Button';

// Force dynamic rendering to always fetch fresh data from Supabase
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let apps = [];
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
    console.error('Failed to fetch apps from database:', error);
  }

  // Filter featured apps
  const featuredApps = apps.filter((app: any) => app.is_featured);

  return (
    <div className="flex flex-col gap-16 py-8 relative">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center max-w-3xl mx-auto pt-6 gap-6 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-xs font-semibold text-violet-400 tracking-wide animate-pulse uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          The Home of Arc DApps
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none">
          Discover the Best Apps in the{' '}
          <span className="bg-gradient-to-r from-brand-cyan via-indigo-400 to-brand-violet bg-clip-text text-transparent">
            Arc Ecosystem
          </span>
        </h1>
        
        <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
          Explore DeFi, NFTs, gaming platforms, tools, and social networks built on top of the ultra-fast, decentralized Arc Ledger.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link href="/apps">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Explore Directory
            </Button>
          </Link>
          <Link href="/submit">
            <Button variant="glass" size="lg" leftIcon={<UploadCloud className="h-4.5 w-4.5" />}>
              Submit Your App
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Apps Section */}
      <section className="flex flex-col gap-6 w-full z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-pink" />
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Featured Ecosystem Apps</h2>
        </div>
        <FeaturedCarousel apps={featuredApps} />
      </section>

      {/* Explore Grid Section */}
      <section className="flex flex-col gap-8 w-full z-10">
        <div className="flex items-center justify-between gap-4 border-b border-brand-border/40 pb-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Browse Directory</h2>
          </div>
          <Link href="/apps" className="text-xs font-semibold text-brand-cyan hover:text-white transition-colors flex items-center gap-1">
            View All DApps <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <AppGrid apps={apps} />
      </section>
    </div>
  );
}
