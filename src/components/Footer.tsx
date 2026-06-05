'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <footer className="border-t border-brand-border/60 bg-brand-bg/40 backdrop-blur-sm relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-brand-border/60 shadow-[0_0_8px_rgba(0,242,254,0.15)] group-hover:border-brand-cyan/40 transition-all duration-300">
                <img 
                  src="/logo.jpg" 
                  alt="Arc Logo" 
                  className="object-cover h-full w-full"
                />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                ARC <span className="text-brand-cyan">APP STORE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Discover and explore the best decentralized applications, DeFi platforms, NFT marketplaces, and tooling built on the Arc ecosystem.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-cyan transition-colors flex items-center justify-center">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-cyan transition-colors flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-cyan transition-colors flex items-center justify-center">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Store Directory</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/apps" className="hover:text-brand-cyan transition-colors">All Applications</Link>
              </li>
              <li>
                <Link href="/apps?category=DeFi" className="hover:text-brand-cyan transition-colors">DeFi Apps</Link>
              </li>
              <li>
                <Link href="/apps?category=Gaming" className="hover:text-brand-cyan transition-colors">Web3 Gaming</Link>
              </li>
              <li>
                <Link href="/apps?category=NFT" className="hover:text-brand-cyan transition-colors">NFTs & Collectibles</Link>
              </li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/submit" className="hover:text-brand-cyan transition-colors">Submit Application</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-cyan transition-colors">Admin Dashboard</Link>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">Developer Docs</a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Arc App Store. All rights reserved.</p>
          <p>Built for the Arc Ecosystem.</p>
        </div>
      </div>
    </footer>
  );
};
