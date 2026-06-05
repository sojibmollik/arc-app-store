import React from 'react';
import { redirect } from 'next/navigation';
import { Inbox } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { PendingSubmissionsList } from '@/components/PendingSubmissionsList';

export const dynamic = 'force-dynamic';

export default async function PendingSubmissionsPage() {
  const supabase = await createClient();
  
  // 1. Auth Guard - redirect if not logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin');
  }

  // 2. Fetch pending submissions list
  let submissions = [];
  try {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }); // oldest first to review chronologically
    
    if (data) {
      submissions = data;
    }
  } catch (err) {
    console.error('Failed to load pending submissions for admin panel:', err);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <section className="flex flex-col gap-2 border-b border-brand-border/40 pb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Inbox className="h-6 w-6 text-brand-pink" /> Pending Review
        </h1>
        <p className="text-slate-400 text-sm">
          Review developer applications. Approve to automatically register and publish the app or reject the submission.
        </p>
      </section>

      {/* Reviewer List Container */}
      <section className="w-full">
        <PendingSubmissionsList submissions={submissions} />
      </section>
    </div>
  );
}
