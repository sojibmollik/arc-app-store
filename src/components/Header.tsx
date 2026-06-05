'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Cpu } from 'lucide-react';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // If we are in the admin dashboard, we want to hide the public header (admin has its own sidebar layout)
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  const navLinks = [
    { name: 'Featured', href: '/' },
    { name: 'Explore Apps', href: '/apps' },
    { name: 'Submit App', href: '/submit' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border/60 bg-brand-bg/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-brand-border/60 shadow-[0_0_10px_rgba(138,43,226,0.15)] group-hover:border-brand-cyan/50 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.35)] transition-all duration-300">
                <img 
                  src="/logo.jpg" 
                  alt="Arc Logo" 
                  className="object-cover h-full w-full"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-wide">
                ARC <span className="text-brand-cyan font-semibold">APP STORE</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-cyan bg-brand-violet/10 border border-brand-violet/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Admin Login */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/admin">
              <span className="text-xs text-slate-400 hover:text-brand-cyan transition-colors duration-200 cursor-pointer">
                Admin Panel
              </span>
            </Link>
            <Link href="/submit">
              <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                List Your App
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-brand-card focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t-0 border-x-0 absolute top-16 left-0 w-full px-2 pt-2 pb-4 space-y-1 sm:px-3 animate-fade-in shadow-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'text-brand-cyan bg-brand-violet/15 border border-brand-violet/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 pb-2 border-t border-brand-border/40 px-3 flex flex-col gap-3">
            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-sm text-slate-400 hover:text-brand-cyan">
              Admin Portal
            </Link>
            <Link href="/submit" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                List Your App
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
