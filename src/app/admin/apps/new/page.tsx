'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Cpu, AlertCircle, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { createManualAppWithFiles } from '@/lib/actions/admin';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input, TextArea, Select } from '@/components/ui/Input';

export default function NewManualAppPage() {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

  const categories = [
    { value: 'DeFi', label: 'DeFi (Decentralized Finance)' },
    { value: 'NFT', label: 'NFTs & Collectibles' },
    { value: 'Gaming', label: 'Gaming / GameFi' },
    { value: 'Tools', label: 'Developer Tools & Wallets' },
    { value: 'Social', label: 'Social Networks / DAOs' },
    { value: 'Infrastructure', label: 'Nodes & Core Infra' },
    { value: 'Other', label: 'Other' },
  ];

  // Handle logo file preview
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size cannot exceed 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  // Handle screenshots multi-files preview
  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      alert('You can upload a maximum of 4 screenshots');
      return;
    }

    const previews: string[] = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5MB size limit`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setScreenshotPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionResult(null);

    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createManualAppWithFiles(null, formData);
      setActionResult(res);

      if (res.success) {
        alert(res.message);
        router.push('/admin/apps');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link href="/admin/apps" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-cyan transition-colors">
          <ArrowLeft className="h-4 w-4" /> BACK TO MANAGE APPS
        </Link>
      </div>

      <Card className="border border-brand-border/60">
        <CardHeader className="p-6 border-b border-brand-border/40 bg-brand-dark/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-violet/10 text-brand-cyan rounded-lg border border-brand-violet/20">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-extrabold">Add New App Manually</CardTitle>
              <CardDescription className="text-xs">
                Register a new application directly into the database with custom approval & featured parameters.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {actionResult && !actionResult.success && (
              <div className="p-4 rounded-lg bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-medium flex gap-3 items-center">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                {actionResult.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* App Name */}
              <Input
                label="App Name"
                name="name"
                placeholder="e.g. ArcSwap"
                required
                disabled={isPending}
              />

              {/* Category */}
              <Select
                label="Category"
                name="category"
                options={categories}
                required
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Website URL */}
              <Input
                label="Website URL"
                name="website"
                type="url"
                placeholder="https://yourdapp.io"
                required
                disabled={isPending}
              />

              {/* Blockchain */}
              <Input
                label="Blockchain / Ledger (Optional)"
                name="blockchain"
                placeholder="e.g. Arc Network, Ethereum"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-brand-border/45 py-6">
              {/* Approval status */}
              <Select
                label="Approval State (Public Visibility)"
                name="approved"
                options={[
                  { value: 'true', label: 'Approved (Visible to Public)' },
                  { value: 'false', label: 'Pending / Unapproved (Hidden)' }
                ]}
                required
                disabled={isPending}
              />

              {/* Featured status */}
              <Select
                label="Featured Status"
                name="is_featured"
                options={[
                  { value: 'false', label: 'Standard app listing' },
                  { value: 'true', label: 'Featured (Show in Homepage Carousel)' }
                ]}
                required
                disabled={isPending}
              />
            </div>

            {/* Short Description */}
            <Input
              label="Short Description"
              name="short_description"
              placeholder="A brief one-sentence pitch of your app (min 10 characters)"
              required
              disabled={isPending}
            />

            {/* Detailed Description */}
            <TextArea
              label="Detailed Description"
              name="description"
              placeholder="Explain what your app does, its main features, and target users. Markdown formatting is supported (min 30 characters)."
              required
              rows={5}
              disabled={isPending}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-brand-border/40 pt-4">
              {/* Twitter */}
              <Input
                label="Twitter / X Link"
                name="twitter"
                type="url"
                placeholder="https://x.com/yourhandle"
                disabled={isPending}
              />
              {/* Telegram */}
              <Input
                label="Telegram Link"
                name="telegram"
                type="url"
                placeholder="https://t.me/yourchannel"
                disabled={isPending}
              />
              {/* Discord */}
              <Input
                label="Discord Link"
                name="discord"
                type="url"
                placeholder="https://discord.gg/yourinvite"
                disabled={isPending}
              />
            </div>

            {/* Verification Wallet */}
            <Input
              label="Wallet Address for Verification (Optional)"
              name="wallet_address"
              placeholder="e.g. 0x1a2b...3c4d"
              disabled={isPending}
            />

            {/* Files Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-brand-border/40 pt-6">
              {/* Logo Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  App Logo (Ratio 1:1, Max 2MB)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl border border-brand-border/60 bg-brand-dark flex items-center justify-center text-slate-500 overflow-hidden flex-shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6" />
                    )}
                  </div>
                  <label className="cursor-pointer glass-panel px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-all">
                    Choose Logo
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      required
                      disabled={isPending}
                    />
                  </label>
                </div>
              </div>

              {/* Screenshots Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Screenshots (Up to 4, Max 5MB each)
                </label>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer glass-panel p-3 rounded-lg border border-dashed border-brand-border/60 hover:border-brand-cyan/60 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all">
                    <UploadCloud className="h-4.5 w-4.5 text-brand-cyan" />
                    Upload Screenshot Files
                    <input
                      type="file"
                      name="screenshots"
                      accept="image/*"
                      multiple
                      onChange={handleScreenshotsChange}
                      className="hidden"
                      required
                      disabled={isPending}
                    />
                  </label>
                  
                  {/* Screenshot thumbnails count */}
                  {screenshotPreviews.length > 0 && (
                    <span className="text-xs text-brand-cyan font-semibold">
                      {screenshotPreviews.length} screenshot(s) selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="border-t border-brand-border/40 pt-6 flex items-center justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={isPending} className="min-w-[150px]">
                Create App Manual
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
