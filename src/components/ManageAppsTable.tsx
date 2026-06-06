'use client';

import React, { useState, useTransition } from 'react';
import { Trash2, Image as ImageIcon, Plus, Cpu, AlertCircle, UploadCloud } from 'lucide-react';
import { App } from '@/types';
import { deleteApp, createManualAppWithFiles } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/Button';
import { Input, TextArea } from './ui/Input';

interface ManageAppsProps {
  apps: App[];
}

export const ManageAppsTable: React.FC<ManageAppsProps> = ({ apps }) => {
  const [isPending, startTransition] = useTransition();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const website = formData.get('website') as string;
    const description = formData.get('description') as string;
    const logoFile = formData.get('logo') as File;

    if (!name || name.trim().length < 2) {
      setErrorMsg('Please enter a valid app name.');
      return;
    }
    if (!website || !website.startsWith('http')) {
      setErrorMsg('Please enter a website starting with http:// or https://');
      return;
    }
    if (!description || description.trim().length < 10) {
      setErrorMsg('Please enter a description (at least 10 characters).');
      return;
    }
    if (!logoFile || logoFile.size === 0) {
      setErrorMsg('Please choose an app picture.');
      return;
    }

    // Set defaults for complex fields to keep the manual form simple
    formData.append('short_description', description.substring(0, 100)); // auto short description
    formData.append('category', 'DeFi'); // default category
    formData.append('blockchain', 'Arc Network'); // default blockchain
    formData.append('approved', 'true'); // auto approved and visible
    formData.append('is_featured', 'false'); // not featured by default
    
    // The database insertion needs screenshots. We map the logo image as a screenshot to satisfy it.
    formData.append('screenshots', logoFile); 

    startTransition(async () => {
      const res = await createManualAppWithFiles(null, formData);
      if (res.success) {
        form.reset();
        setLogoPreview(null);
        alert('App added successfully!');
      } else {
        setErrorMsg(res.message);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;
    startTransition(async () => {
      const res = await deleteApp(id);
      if (!res.success) {
        alert(`Failed to delete: ${res.message}`);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* 1. Simplified Add Form Card (Left Column) */}
      <div className="lg:col-span-1">
        <Card className="border border-brand-border/60 sticky top-24">
          <CardHeader className="border-b border-brand-border/40 p-5 bg-brand-dark/15">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-cyan" /> Add New Application
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errorMsg}
                </div>
              )}

              <Input
                label="App Name"
                name="name"
                placeholder="e.g. ArcSwap"
                required
                disabled={isPending}
              />

              <Input
                label="Website URL"
                name="website"
                type="url"
                placeholder="https://example.com"
                required
                disabled={isPending}
              />

              <TextArea
                label="App Detail / Description"
                name="description"
                placeholder="Describe what your application does..."
                required
                rows={4}
                disabled={isPending}
              />

              {/* Logo / Picture Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  App Picture / Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl border border-brand-border/60 bg-brand-dark flex items-center justify-center text-slate-500 overflow-hidden flex-shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </div>
                  <label className="cursor-pointer glass-panel px-4 py-2 rounded-lg text-xs font-semibold text-slate-355 hover:text-white hover:border-slate-500 transition-all">
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
                className="w-full mt-2"
                isLoading={isPending}
                leftIcon={<Plus className="h-4.5 w-4.5" />}
              >
                Add Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 2. Simplified App Cards Grid with Delete (Right Column) */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-brand-border/40 pb-3">
          <Cpu className="h-5 w-5 text-brand-violet" /> Current Applications ({apps.length})
        </h3>

        {apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app) => (
              <Card key={app.id} className="border border-brand-border/50 bg-brand-card/40 flex flex-col justify-between overflow-hidden">
                <CardContent className="p-5 flex gap-4 items-start">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-brand-border/60 bg-slate-950 flex-shrink-0">
                    <img src={app.logo_url} alt={app.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-base truncate">{app.name}</h4>
                    <a href={app.website} target="_blank" rel="noreferrer" className="text-xs text-brand-cyan hover:underline truncate mt-0.5 block">
                      {app.website.replace(/https?:\/\/(www\.)?/, '')}
                    </a>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                </CardContent>
                <div className="px-5 py-3 bg-brand-dark/10 border-t border-brand-border/30 flex justify-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(app.id)}
                    disabled={isPending}
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Delete App
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-brand-border/60 rounded-xl bg-brand-dark/5">
            <Cpu className="h-10 w-10 text-slate-500 mb-3" />
            <p className="text-slate-400 text-sm">No applications listed. Use the form on the left to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
};
