export type AppCategory = 'DeFi' | 'NFT' | 'Gaming' | 'Tools' | 'Social' | 'Infrastructure' | 'Other';

export interface App {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  screenshot_urls: string[];
  description: string;
  short_description: string;
  category: AppCategory;
  website: string;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
  blockchain?: string | null;
  wallet_address?: string | null;
  approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Submission {
  id: string;
  name: string;
  logo_url: string;
  screenshot_urls: string[];
  description: string;
  short_description: string;
  category: AppCategory;
  website: string;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
  blockchain?: string | null;
  wallet_address?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface AdminStats {
  totalApps: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
}
