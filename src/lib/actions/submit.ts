'use server';

import { createAdminClient } from '@/lib/supabaseServer';

async function uploadFile(file: File, folder: string): Promise<string> {
  const adminClient = createAdminClient();
  const fileExt = file.name.split('.').pop() || 'png';
  const randId = Math.random().toString(36).substring(2, 15);
  const fileName = `${randId}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await adminClient.storage
    .from('arc-app-store')
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = adminClient.storage
    .from('arc-app-store')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export type ActionResponse = {
  success: boolean;
  message: string;
  submissionId?: string;
};

export async function submitApp(prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const name = formData.get('name') as string;
    const website = formData.get('website') as string;
    const description = formData.get('description') as string;
    const logoFile = formData.get('logo') as File;

    // 1. Basic validation (only essential fields)
    if (!name || name.trim().length < 2) {
      return { success: false, message: 'App Name must be at least 2 characters.' };
    }
    if (!website || !website.startsWith('http')) {
      return { success: false, message: 'Please enter a valid website URL starting with http:// or https://' };
    }
    if (!description || description.trim().length < 10) {
      return { success: false, message: 'Please write a description (at least 10 characters).' };
    }
    if (!logoFile || logoFile.size === 0) {
      return { success: false, message: 'Please upload an app picture/logo.' };
    }
    if (logoFile.size > 5 * 1024 * 1024) { // 5MB limit
      return { success: false, message: 'App picture size cannot exceed 5MB.' };
    }

    // 2. Upload Logo File
    let logoUrl = '';
    try {
      logoUrl = await uploadFile(logoFile, 'logos');
    } catch (err: any) {
      return { success: false, message: `Picture upload failed: ${err.message}` };
    }

    // 3. Optional Screenshots (default to empty or contains logo)
    const screenshotUrls: string[] = [logoUrl];

    // 4. Save to Submissions table (with fallback defaults)
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('submissions')
      .insert({
        name,
        logo_url: logoUrl,
        screenshot_urls: screenshotUrls,
        description,
        short_description: description.substring(0, 100), // Auto-generate short description
        category: 'Other', // Default category
        website,
        blockchain: 'Arc Network', // Default blockchain
        status: 'pending',
      });

    if (error) {
      console.error('Database Insertion Error:', error);
      return { success: false, message: `Database save failed: ${error.message}` };
    }

    return {
      success: true,
      message: 'Your application has been submitted successfully! Our moderators will review it shortly.',
    };
  } catch (err: any) {
    console.error('Submission Server Action Error:', err);
    return { success: false, message: `An unexpected error occurred: ${err.message}` };
  }
}
