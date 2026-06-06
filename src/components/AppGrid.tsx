'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Compass, Grid, Laptop, Flame, Star, ShieldAlert } from 'lucide-react';
import { App, AppCategory } from '@/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface AppGridProps {
  apps: App[];
  initialCategory?: string;
}

export const AppGrid: React.FC<AppGridProps> = ({ apps, initialCategory = 'All' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // High quality fallback mock data if DB is empty
  const displayApps = useMemo(() => {
    if (apps.length > 0) return apps;
    return [
      {
        id: 'mock-1',
        name: 'ArcSwap',
        slug: 'arcswap',
        logo_url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128&q=80',
        screenshot_urls: [],
        short_description: 'The premier decentralized exchange on Arc, providing zero-slippage trades and concentrated liquidity pools.',
        description: 'DEX platform.',
        category: 'DeFi' as const,
        website: 'https://arcswap.finance',
        blockchain: 'Arc Network',
        is_featured: true,
        approved: true,
        created_at: '',
        updated_at: ''
      },
      {
        id: 'mock-2',
        name: 'NeoRealm',
        slug: 'neorealm',
        logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
        screenshot_urls: [],
        short_description: 'A massive multiplayer sci-fi strategy game built on the Arc Ledger, featuring player-owned starships as NFTs.',
        description: 'Multiplayer game.',
        category: 'Gaming' as const,
        website: 'https://neorealm.io',
        blockchain: 'Arc Ledger',
        is_featured: true,
        approved: true,
        created_at: '',
        updated_at: ''
      },
      {
        id: 'mock-3',
        name: 'Sentinel Guard',
        slug: 'sentinel-guard',
        logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&q=80',
        screenshot_urls: [],
        short_description: 'Advanced multisig smart-contract wallet and defense monitoring system for enterprise assets in the Arc ecosystem.',
        description: 'Multisig tool.',
        category: 'Tools' as const,
        website: 'https://sentinelguard.xyz',
        blockchain: 'Arc Network',
        is_featured: true,
        approved: true,
        created_at: '',
        updated_at: ''
      },
      {
        id: 'mock-4',
        name: 'ArcLend',
        slug: 'arclend',
        logo_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&q=80',
        screenshot_urls: [],
        short_description: 'Decentralized liquidity market where users can participate as depositors or borrowers on Arc.',
        description: 'Lending pool.',
        category: 'DeFi' as const,
        website: 'https://arclend.finance',
        blockchain: 'Arc Network',
        is_featured: false,
        approved: true,
        created_at: '',
        updated_at: ''
      },
      {
        id: 'mock-5',
        name: 'Canvas Market',
        slug: 'canvas-market',
        logo_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=128&q=80',
        screenshot_urls: [],
        short_description: 'Open decentralized marketplace for trading digital art, domain names, and gaming items in the Arc ecosystem.',
        description: 'NFT hub.',
        category: 'NFT' as const,
        website: 'https://canvasmarket.art',
        blockchain: 'Arc Ledger',
        is_featured: false,
        approved: true,
        created_at: '',
        updated_at: ''
      },
      {
        id: 'mock-6',
        name: 'Pulse Social',
        slug: 'pulse-social',
        logo_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=128&q=80',
        screenshot_urls: [],
        short_description: 'A Web3 decentralized social platform allowing content creators to tokenize their profiles and posts.',
        description: 'Decentralized social.',
        category: 'Social' as const,
        website: 'https://pulsesocial.network',
        blockchain: 'Arc Network',
        is_featured: false,
        approved: true,
        created_at: '',
        updated_at: ''
      }
    ];
  }, [apps]);

  const categories = ['All', 'DeFi', 'NFT', 'Gaming', 'Tools', 'Social', 'Infrastructure', 'Other'];

  // Filtering Logic
  const filteredApps = useMemo(() => {
    return displayApps.filter((app) => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.blockchain && app.blockchain.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [displayApps, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Search & Category Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Category Pill Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none scroll-smooth -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-brand-violet text-white border-brand-violet shadow-[0_0_15px_rgba(138,43,226,0.3)]'
                  : 'glass-panel text-slate-300 border-brand-border/60 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <div className="relative min-w-full lg:min-w-[320px] max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-panel pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/30 outline-none transition-all duration-200 neon-border-cyan"
          />
        </div>
      </div>

      {/* Grid of Apps */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Link key={app.id} href={`/app/${app.slug}`} className="block h-full group">
              <Card hoverEffect className="flex flex-col justify-between h-full">
                <CardContent className="p-5 flex flex-col gap-4 flex-1">
                  {/* Card Header (Logo, Name, Tags) */}
                  <div className="flex gap-4 items-start">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-brand-border/80 bg-slate-950 flex-shrink-0">
                      <Image
                        src={app.logo_url}
                        alt={`${app.name} logo`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors leading-snug truncate">
                        {app.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                        {app.website.replace(/https?:\/\/(www\.)?/, '')}
                      </p>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {app.short_description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    <Badge variant="violet">{app.category}</Badge>
                    {app.blockchain && <Badge variant="cyan">{app.blockchain}</Badge>}
                    {app.is_featured && <Badge variant="pink">Featured</Badge>}
                  </div>
                </CardContent>

                {/* Card Footer (View Details CTA) */}
                <div className="px-5 py-3 border-t border-brand-border/40 bg-brand-dark/10 flex items-center justify-between">
                  <div className="w-full text-center py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/25 group-hover:text-brand-cyan transition-all duration-200">
                    View Details
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-brand-border/60 rounded-xl bg-brand-dark/5">
          <ShieldAlert className="h-12 w-12 text-slate-500 mb-3" />
          <h3 className="text-slate-300 font-semibold text-lg">No Applications Found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">
            Try adjusting your search criteria or explore another category.
          </p>
        </div>
      )}
    </div>
  );
};
