'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { UploadCloud, Image as ImageIcon, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitApp } from '@/lib/actions/submit';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input, TextArea, Select } from '@/components/ui/Input';

export default function SubmitPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('App picture size cannot exceed 5MB.');
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const website = formData.get('website') as string;
    const description = formData.get('description') as string;
    const logoFile = formData.get('logo') as File;
    const twitter = formData.get('twitter') as string;

    if (!name || name.trim().length < 2) {
      setActionResult({ success: false, message: 'Please enter a valid App Name (min 2 characters).' });
      return;
    }
    if (!website || !website.startsWith('http')) {
      setActionResult({ success: false, message: 'Please enter a website URL starting with http:// or https://' });
      return;
    }
    if (twitter && !twitter.startsWith('http')) {
      setActionResult({ success: false, message: 'Please enter a Twitter URL starting with http:// or https://' });
      return;
    }
    if (!description || description.trim().length < 10) {
      setActionResult({ success: false, message: 'Please enter a description (min 10 characters).' });
      return;
    }
    if (!logoFile || logoFile.size === 0) {
      setActionResult({ success: false, message: 'App picture is required.' });
      return;
    }

    startTransition(async () => {
      const result = await submitApp(null, formData);
      setActionResult(result);

      if (result.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8a2be2', '#00f2fe', '#ff007f']
        });
      }
    });
  };

  if (actionResult?.success) {
    return (
      <div className="max-w-2xl mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-fade-in relative z-10">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Application Submitted!</h1>
        <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed">{actionResult.message}</p>
        <div className="flex gap-4 mt-4 w-full justify-center">
          <Link href="/"><Button variant="primary">Return Home</Button></Link>
          <Link href="/apps"><Button variant="outline">Browse Directory</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 relative z-10 flex flex-col gap-6">
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-cyan transition-colors">
          <ArrowLeft className="h-4 w-4" /> BACK TO HOME
        </Link>
      </div>

      <Card className="border border-brand-border/60">
        <CardHeader className="text-center p-6 bg-brand-dark/10 border-b border-brand-border/40">
          <div className="mx-auto p-2 rounded-xl border border-brand-border/60 w-fit mb-3">
            <img src="/logo.jpg" alt="Arc Logo" className="h-8 w-8 rounded" />
          </div>
          <CardTitle className="text-2xl font-extrabold">Submit DApp</CardTitle>
          <CardDescription className="mt-1">
            Submit your decentralized application to the Arc Ecosystem Directory.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {actionResult && !actionResult.success && (
              <div className="p-4 rounded-lg bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-medium flex gap-3 items-center">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {actionResult.message}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="App Name"
                name="name"
                placeholder="e.g. ArcSwap"
                required
                disabled={isPending}
              />

              <Select
                label="Category"
                name="category"
                options={categories}
                required
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Website URL"
                name="website"
                type="url"
                placeholder="https://example.com"
                required
                disabled={isPending}
              />

              <Input
                label="Twitter / X Link (Optional)"
                name="twitter"
                type="url"
                placeholder="https://x.com/yourhandle"
                disabled={isPending}
              />
            </div>

            <TextArea
              label="App Detail / Description"
              name="description"
              placeholder="Describe what your application does..."
              required
              rows={5}
              disabled={isPending}
            />

            {/* Logo / Picture Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                App Picture / Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl border border-brand-border/60 bg-brand-dark flex items-center justify-center text-slate-500 overflow-hidden flex-shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6" />
                  )}
                </div>
                <label className="cursor-pointer glass-panel px-4 py-2 rounded-lg text-xs font-semibold text-slate-350 hover:text-white hover:border-slate-500 transition-all">
                  Choose Picture
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

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              isLoading={isPending}
              leftIcon={<UploadCloud className="h-4.5 w-4.5" />}
            >
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
