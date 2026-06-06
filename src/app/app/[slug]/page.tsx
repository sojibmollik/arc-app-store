import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Globe, Send, MessageSquare, Shield, CheckCircle, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

interface AppDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AppDetailPage({ params }: AppDetailPageProps) {
  const { slug } = await params;
  let app = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('apps')
      .select('*')
      .eq('slug', slug)
      .eq('approved', true)
      .single();
    
    if (data) {
      app = data;
    }
  } catch (error) {
    console.error(`Failed to fetch app with slug ${slug}:`, error);
  }

  // Fallback mocks for local preview / empty database demo
  if (!app) {
    const mocks: Record<string, any> = {
      'arcswap': {
        name: 'ArcSwap',
        slug: 'arcswap',
        logo_url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128&q=80',
        screenshot_urls: [
          'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=1000&q=80',
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&q=80'
        ],
        short_description: 'The premier decentralized exchange on Arc, providing zero-slippage trades and concentrated liquidity pools.',
        description: 'ArcSwap is the core automated market maker (AMM) built to service the Arc ecosystem. It enables traders to swap native tokens and stablecoins directly from their wallets with instant confirmation and near-zero fees. LPs can deposit liquidity into concentrated ranges to maximize fee efficiency, while developers can integrate the swap widget directly into their DApps for seamless in-app exchanges.\n\n### Key Features:\n- **Concentrated Liquidity Pools**: Earn higher yields on capital relative to traditional v2 pools.\n- **Limit Orders**: Trade assets at specific price ranges completely on-chain.\n- **Analytics Dashboard**: Monitor trading volumes, TVL, and pool performance in real-time.\n- **Direct Routing Router**: Highly optimized smart contracts routing trades through the path of lowest fees.',
        category: 'DeFi',
        website: 'https://arcswap.finance',
        twitter: 'https://twitter.com/arcswap',
        telegram: 'https://t.me/arcswap',
        discord: 'https://discord.gg/arcswap',
        blockchain: 'Arc Network',
        wallet_address: '0x1234...5678',
        approved: true,
        is_featured: true
      },
      'neorealm': {
        name: 'NeoRealm',
        slug: 'neorealm',
        logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
        screenshot_urls: [
          'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1000&q=80',
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=80'
        ],
        short_description: 'A massive multiplayer sci-fi strategy game built on the Arc Ledger, featuring player-owned starships as NFTs.',
        description: 'NeoRealm is an open-world space exploration and battle MMO running on the Arc Ledger. Players command customizable starships, mine resources from asteroids, establish trade routes, and form alliances to dominate galaxies. Every starship, planet colony, and cargo container is a true digital asset (NFT) that players can freely trade or customize.\n\n### Key Features:\n- **Decentralized Economy**: Trade raw materials and components in an open market powered by the native ecosystem token.\n- **Staking Hub**: Stake your ship NFTs in defense systems to earn passive yields.\n- **Governance Council**: Vote on resource taxes and border security policies using governance tokens.\n- **Low Latency Tick Rate**: Runs seamlessly with high-speed Arc ledger sub-second transaction times.',
        category: 'Gaming',
        website: 'https://neorealm.io',
        twitter: 'https://twitter.com/neorealm',
        discord: 'https://discord.gg/neorealm',
        blockchain: 'Arc Ledger',
        wallet_address: '0x5555...6666',
        approved: true,
        is_featured: true
      },
      'sentinel-guard': {
        name: 'Sentinel Guard',
        slug: 'sentinel-guard',
        logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&q=80',
        screenshot_urls: [
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&q=80',
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&q=80'
        ],
        short_description: 'Advanced multisig smart-contract wallet and defense monitoring system for enterprise assets in the Arc ecosystem.',
        description: 'Sentinel Guard provides bank-grade multisig wallets, threshold transaction validation, and programmatic compliance triggers for DAOs, hedge funds, and enterprises. Users can configure multi-signature signers, set daily transfer thresholds, and trigger automated emergency lockdowns based on smart-contract warning systems.\n\n### Key Features:\n- **Flexible Signature Logic**: Define M-of-N layouts with options to include hardware keys or cold storage accounts.\n- **Transaction Queues**: Create and review upcoming team transactions in a secure environment.\n- **Gasless Executions**: Setup relayers for gasless signatures to simplify user operations.\n- **Real-time Notifications**: Telegram and Email bots notify signers of pending transactions.',
        category: 'Tools',
        website: 'https://sentinelguard.xyz',
        twitter: 'https://twitter.com/sentinelguard',
        telegram: 'https://t.me/sentinelguard',
        blockchain: 'Arc Network',
        approved: true,
        is_featured: true
      }
    };

    app = mocks[slug] || null;
  }

  if (!app) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10 py-6 relative z-10">
      {/* Back button */}
      <div>
        <Link href="/apps" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-cyan transition-colors">
          <ArrowLeft className="h-4 w-4" /> BACK TO DIRECTORY
        </Link>
      </div>

      {/* Main Header Card */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-brand-border/60">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Logo */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-brand-border/80 bg-slate-950 flex-shrink-0">
            <Image
              src={app.logo_url}
              alt={`${app.name} logo`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          {/* Title, slug, tags */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{app.name}</h1>
              {app.is_featured && <Badge variant="pink">FEATURED</Badge>}
            </div>
            <p className="text-slate-400 text-sm">{app.short_description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="violet">{app.category}</Badge>
              {app.blockchain && <Badge variant="cyan">{app.blockchain}</Badge>}
            </div>
          </div>
        </div>

        {/* Call to action launch buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a href={app.website} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none">
            <Button variant="primary" className="w-full" rightIcon={<ExternalLink className="h-4 w-4" />}>
              Launch App
            </Button>
          </a>
          <Link href={`/submit?category=${app.category}`} className="flex-1 sm:flex-none">
            <Button variant="glass" className="w-full" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
              Apply Similar App
            </Button>
          </Link>
        </div>
      </section>

      {/* Two Column Layout (Details / Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details & Screenshots (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Screenshots Gallery */}
          {app.screenshot_urls && app.screenshot_urls.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Screenshots ({app.screenshot_urls.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {app.screenshot_urls.map((url: string, index: number) => (
                  <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-brand-border/60 bg-slate-900 group">
                    <Image
                      src={url}
                      alt={`${app.name} screenshot ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Long Description */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">About {app.name}</h2>
            <div className="glass-panel rounded-xl p-6 border border-brand-border/40 prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line">
              {app.description}
            </div>
          </section>
        </div>

        {/* Sidebar Info (Right 1/3) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
                Application Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Website</span>
                  <a
                    href={app.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-brand-cyan hover:text-white transition-colors mt-0.5"
                  >
                    <Globe className="h-4 w-4" />
                    {app.website.replace(/https?:\/\/(www\.)?/, '')}
                  </a>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Category</span>
                  <div className="text-sm text-slate-200 mt-0.5">{app.category}</div>
                </div>

                {app.blockchain && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Network</span>
                    <div className="text-sm text-slate-200 mt-0.5">{app.blockchain}</div>
                  </div>
                )}

                {app.wallet_address && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Verification Wallet</span>
                    <div className="text-xs text-slate-300 font-mono mt-1 bg-brand-dark/40 border border-brand-border/40 p-2 rounded-md truncate select-all" title={app.wallet_address}>
                      {app.wallet_address}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Socials Card */}
          {(app.twitter || app.telegram || app.discord) && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
                  Social Channels
                </h3>
                
                <div className="flex flex-col gap-3">
                  {app.twitter && (
                    <a
                      href={app.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-slate-350 hover:text-white transition-colors text-sm"
                    >
                      <svg className="h-5 w-5 text-sky-400 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter / X
                    </a>
                  )}

                  {app.telegram && (
                    <a
                      href={app.telegram}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-slate-355 hover:text-white transition-colors text-sm"
                    >
                      <Send className="h-5 w-5 text-sky-500" />
                      Telegram
                    </a>
                  )}

                  {app.discord && (
                    <a
                      href={app.discord}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-slate-355 hover:text-white transition-colors text-sm"
                    >
                      <MessageSquare className="h-5 w-5 text-indigo-400" />
                      Discord
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Alert Card */}
          <Card>
            <CardContent className="p-5 flex gap-3.5 items-start">
              <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">Ecosystem Security</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  This application has been manually reviewed by the Arc App Store curators. Always review contract scopes before approving wallet signatures.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
