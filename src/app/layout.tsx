import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Arc App Store - Discover Decentralized Apps',
  description: 'Explore the best Web3 decentralized applications, DeFi protocols, NFT marketplaces, gaming, and tools built on the Arc ecosystem.',
  icons: {
    icon: '/logo.jpg',
  },
  keywords: ['Arc', 'Crypto', 'App Store', 'Web3', 'DeFi', 'DApps', 'NFT', 'Blockchain'],
  openGraph: {
    title: 'Arc App Store - Discover Decentralized Apps',
    description: 'Explore the best Web3 decentralized applications, DeFi protocols, NFT marketplaces, gaming, and tools built on the Arc ecosystem.',
    type: 'website',
    url: 'https://arcappstore.vercel.app',
    siteName: 'Arc App Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arc App Store - Discover Decentralized Apps',
    description: 'Explore the best Web3 decentralized applications, DeFi protocols, NFT marketplaces, gaming, and tools built on the Arc ecosystem.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="font-sans antialiased bg-brand-bg text-slate-100 flex flex-col min-h-screen relative selection:bg-brand-violet/35 selection:text-white">
        {/* Glow Mesh Background */}
        <div className="crypto-glow-mesh" />

        {/* Sticky Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
