'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { ShieldAlert, Check, X, ChevronDown, ChevronUp, Globe, Send, MessageSquare, ExternalLink, Inbox } from 'lucide-react';
import { Submission } from '@/types';
import { approveSubmission, rejectSubmission } from '@/lib/actions/admin';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface PendingSubmissionsListProps {
  submissions: Submission[];
}

export const PendingSubmissionsList: React.FC<PendingSubmissionsListProps> = ({ submissions }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApprove = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to approve "${name}"? This will immediately publish it to the home and explore pages.`)) {
      return;
    }
    
    startTransition(async () => {
      const res = await approveSubmission(id);
      alert(res.message);
    });
  };

  const handleReject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to reject "${name}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await rejectSubmission(id);
      alert(res.message);
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-brand-border/60 rounded-xl bg-brand-dark/5">
        <Inbox className="h-12 w-12 text-slate-500 mb-3" />
        <h3 className="text-slate-300 font-semibold text-lg">No Pending Submissions</h3>
        <p className="text-slate-500 text-sm mt-1">
          Everything is clean! All developer applications have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => {
        const isExpanded = expandedId === sub.id;

        return (
          <Card key={sub.id} className="border border-brand-border/60 overflow-hidden">
            {/* Header row (always visible) */}
            <div
              onClick={() => toggleExpand(sub.id)}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/2 transition-colors select-none"
            >
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-brand-border/60 bg-slate-950 flex-shrink-0">
                  <Image
                    src={sub.logo_url}
                    alt={`${sub.name} logo`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                {/* Summary Info */}
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{sub.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant="violet">{sub.category}</Badge>
                    {sub.blockchain && <Badge variant="cyan">{sub.blockchain}</Badge>}
                    <span className="text-[10px] text-slate-500 font-semibold font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle controls & buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-brand-border/20 pt-3 sm:border-0 sm:pt-0">
                <div className="flex items-center gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    className="border-emerald-500/30 hover:border-emerald-500/80 hover:bg-emerald-500/10 text-emerald-450"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(sub.id, sub.name);
                    }}
                    disabled={isPending}
                    leftIcon={<Check className="h-4 w-4" />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    className="border-brand-pink/30 hover:border-brand-pink/80 hover:bg-brand-pink/10 text-brand-pink"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(sub.id, sub.name);
                    }}
                    disabled={isPending}
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    Reject
                  </Button>
                </div>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
            </div>

            {/* Expanded Content Panel */}
            {isExpanded && (
              <div className="px-5 pb-6 pt-2 border-t border-brand-border/40 bg-brand-dark/20 animate-slide-down space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Detailed text details (Left 2/3) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Short Pitch</h4>
                      <p className="text-sm text-slate-200 font-medium leading-relaxed">{sub.short_description}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Detailed Description</h4>
                      <div className="p-4 bg-brand-dark/40 border border-brand-border/40 rounded-lg text-xs md:text-sm text-slate-350 whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto">
                        {sub.description}
                      </div>
                    </div>

                    {/* Screenshot view */}
                    {sub.screenshot_urls && sub.screenshot_urls.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Submitted Screenshots ({sub.screenshot_urls.length})</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {sub.screenshot_urls.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className="relative aspect-video rounded-lg overflow-hidden border border-brand-border/40 bg-slate-900 group">
                              <Image
                                src={url}
                                alt={`screenshot ${i + 1}`}
                                fill
                                sizes="250px"
                                className="object-cover group-hover:scale-102 transition-transform duration-255"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Links and wallets (Right 1/3) */}
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-dark/40 border border-brand-border/40 rounded-lg space-y-4">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Website</h4>
                        <a
                          href={sub.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-brand-cyan hover:text-white transition-colors mt-1"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          Launch Link
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {(sub.twitter || sub.telegram || sub.discord) && (
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Social Media</h4>
                          <div className="flex flex-col gap-1.5 text-xs text-slate-350">
                            {sub.twitter && (
                              <a href={sub.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                <svg className="h-3.5 w-3.5 text-sky-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                Twitter
                              </a>
                            )}
                            {sub.telegram && (
                              <a href={sub.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                <Send className="h-3.5 w-3.5 text-sky-500" /> Telegram
                              </a>
                            )}
                            {sub.discord && (
                              <a href={sub.discord} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" /> Discord
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {sub.wallet_address && (
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Verification Wallet</h4>
                          <div className="text-[10px] text-slate-300 font-mono mt-1 bg-slate-950 p-2 rounded border border-brand-border/40 truncate select-all" title={sub.wallet_address}>
                            {sub.wallet_address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
