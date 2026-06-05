'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { App } from '@/types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface FeaturedCarouselProps {
  apps: App[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ apps }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // If database is empty, provide high-quality fallback mocked apps to showcase immediately
  const displayApps = apps.length > 0 ? apps : [
    {
      id: 'mock-1',
      name: 'ArcSwap',
      slug: 'arcswap',
      logo_url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128&q=80',
      screenshot_urls: ['https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80'],
      short_description: 'The premier decentralized exchange on Arc, providing zero-slippage trades and concentrated liquidity pools.',
      description: 'The premier DEX.',
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
      screenshot_urls: ['https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80'],
      short_description: 'A massive multiplayer sci-fi strategy game built on the Arc Ledger, featuring player-owned starships as NFTs.',
      description: 'Multiplayer Web3 game.',
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
      screenshot_urls: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80'],
      short_description: 'Advanced multisig smart-contract wallet and defense monitoring system for enterprise assets in the Arc ecosystem.',
      description: 'Multisig smart wallet.',
      category: 'Tools' as const,
      website: 'https://sentinelguard.xyz',
      blockchain: 'Arc Network',
      is_featured: true,
      approved: true,
      created_at: '',
      updated_at: ''
    }
  ];

  useEffect(() => {
    if (displayApps.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % displayApps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [displayApps.length]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? displayApps.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % displayApps.length);
  };

  const currentApp = displayApps[activeIndex];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-brand-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-[360px] md:min-h-[400px] flex flex-col md:flex-row items-stretch group">
      {/* Decorative Glow elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-violet/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[100px] -z-10" />

      {/* Slide Image Area */}
      <Link href={`/app/${currentApp.slug}`} className="relative w-full md:w-1/2 min-h-[220px] md:min-h-full block overflow-hidden">
        {currentApp.screenshot_urls && currentApp.screenshot_urls.length > 0 ? (
          <Image
            src={currentApp.screenshot_urls[0]}
            alt={`${currentApp.name} screenshot`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
            No Screenshot Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-bg via-brand-bg/40 to-transparent" />
      </Link>

      {/* Slide Content Area */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between relative z-10">
        <div>
          {/* Tags */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="pink">FEATURED</Badge>
            <Badge variant="violet">{currentApp.category}</Badge>
            {currentApp.blockchain && <Badge variant="cyan">{currentApp.blockchain}</Badge>}
          </div>

          {/* Title & Logo */}
          <Link href={`/app/${currentApp.slug}`} className="flex items-center gap-4 mb-4 hover:opacity-90 transition-opacity w-fit group/title block">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-brand-border/80 bg-slate-950 flex-shrink-0">
              <Image
                src={currentApp.logo_url}
                alt={`${currentApp.name} logo`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none group-hover/title:text-brand-cyan transition-colors">
                {currentApp.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentApp.website.replace(/https?:\/\/(www\.)?/, '')}
              </p>
            </div>
          </Link>

          {/* Description */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            {currentApp.short_description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <Link href={`/app/${currentApp.slug}`}>
              <Button variant="primary">
                View Details
              </Button>
            </Link>
            <a href={currentApp.website} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                Launch App
              </Button>
            </a>
          </div>

          {/* Carousel Toggles */}
          {displayApps.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg border border-brand-border/60 hover:border-brand-cyan/50 text-slate-400 hover:text-brand-cyan hover:bg-slate-950/40 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-slate-400 font-mono px-1">
                {activeIndex + 1} / {displayApps.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg border border-brand-border/60 hover:border-brand-cyan/50 text-slate-400 hover:text-brand-cyan hover:bg-slate-950/40 transition-all cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
