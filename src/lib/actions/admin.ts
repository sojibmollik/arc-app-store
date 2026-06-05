'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient, createAdminClient, getDbClient } from '@/lib/supabaseServer';
import { AppCategory } from '@/types';

// Slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 1. Admin Authentication Actions
export async function loginAdmin(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: `Authentication failed: ${error.message}` };
    }
  } catch (err: any) {
    return { success: false, message: `An unexpected error occurred: ${err.message}` };
  }

  // Redirect to dashboard on success
  redirect('/admin');
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin');
}

// 2. Fetch Admin Metrics
export async function getAdminStats() {
  try {
    const db = await getDbClient();

    // Query stats from Apps (approved or unapproved)
    const { count: totalApps, error: appsErr } = await db
      .from('apps')
      .select('*', { count: 'exact', head: true });

    // Query stats from Submissions where status = 'pending'
    const { count: pendingSubmissions, error: pendingErr } = await db
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Query stats from Apps where approved = true
    const { count: approvedApps, error: approvedErr } = await db
      .from('apps')
      .select('*', { count: 'exact', head: true })
      .eq('approved', true);

    if (appsErr || pendingErr || approvedErr) {
      console.error('Stats Query Error:', { appsErr, pendingErr, approvedErr });
    }

    return {
      totalApps: totalApps || 0,
      pendingSubmissions: pendingSubmissions || 0,
      approvedSubmissions: approvedApps || 0,
    };
  } catch (err) {
    console.error('Error fetching admin statistics:', err);
    return { totalApps: 0, pendingSubmissions: 0, approvedSubmissions: 0 };
  }
}

// 3. Approve Submission Action
export async function approveSubmission(submissionId: string) {
  try {
    const db = await getDbClient();

    // A. Retrieve the submission details
    const { data: sub, error: fetchErr } = await db
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchErr || !sub) {
      throw new Error(`Failed to find submission: ${fetchErr?.message || 'Not found'}`);
    }

    // B. Check if already approved
    if (sub.status === 'approved') {
      throw new Error('This submission has already been approved.');
    }

    // C. Create slug for the app based on name
    let baseSlug = slugify(sub.name);
    let finalSlug = baseSlug;
    
    // Check if slug already exists, if so append unique random identifier
    const { data: existingApp } = await db
      .from('apps')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();

    if (existingApp) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // D. Insert into apps table with approved = true
    const { error: insertErr } = await db
      .from('apps')
      .insert({
        name: sub.name,
        slug: finalSlug,
        logo_url: sub.logo_url,
        screenshot_urls: sub.screenshot_urls,
        description: sub.description,
        short_description: sub.short_description,
        category: sub.category,
        website: sub.website,
        twitter: sub.twitter,
        telegram: sub.telegram,
        discord: sub.discord,
        blockchain: sub.blockchain,
        wallet_address: sub.wallet_address,
        approved: true,
        is_featured: false,
      });

    if (insertErr) {
      throw new Error(`Failed to create app record: ${insertErr.message}`);
    }

    // E. Update submission status to approved
    const { error: updateErr } = await db
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', submissionId);

    if (updateErr) {
      console.error('Warning: App created, but failed to update submission status:', updateErr);
    }

    // F. Revalidate Cache Paths
    revalidatePath('/');
    revalidatePath('/apps');
    revalidatePath(`/app/${finalSlug}`);
    revalidatePath('/admin/pending');
    revalidatePath('/admin/apps');

    return { success: true, message: `App "${sub.name}" approved and published successfully!` };
  } catch (err: any) {
    console.error('Approve Submission Error:', err);
    return { success: false, message: err.message || 'An error occurred during approval.' };
  }
}

// 4. Reject Submission Action
export async function rejectSubmission(submissionId: string) {
  try {
    const db = await getDbClient();

    const { error } = await db
      .from('submissions')
      .update({ status: 'rejected' })
      .eq('id', submissionId);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    revalidatePath('/admin/pending');

    return { success: true, message: 'Submission marked as rejected.' };
  } catch (err: any) {
    console.error('Reject Submission Error:', err);
    return { success: false, message: err.message };
  }
}

// 5. Delete Approved App Action
export async function deleteApp(appId: string) {
  try {
    const db = await getDbClient();

    const { error } = await db
      .from('apps')
      .delete()
      .eq('id', appId);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    revalidatePath('/');
    revalidatePath('/apps');
    revalidatePath('/admin/apps');

    return { success: true, message: 'Application deleted successfully.' };
  } catch (err: any) {
    console.error('Delete App Error:', err);
    return { success: false, message: err.message };
  }
}

// 6. Update App Details Action
export async function updateApp(appId: string, updatedFields: {
  name: string;
  category: AppCategory;
  website: string;
  blockchain?: string | null;
  short_description: string;
  description: string;
  is_featured: boolean;
  approved: boolean;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
}) {
  try {
    const db = await getDbClient();

    const { data: oldApp } = await db
      .from('apps')
      .select('slug')
      .eq('id', appId)
      .single();

    const { error } = await db
      .from('apps')
      .update(updatedFields)
      .eq('id', appId);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    revalidatePath('/');
    revalidatePath('/apps');
    if (oldApp) {
      revalidatePath(`/app/${oldApp.slug}`);
    }
    revalidatePath('/admin/apps');

    return { success: true, message: 'Application details updated successfully.' };
  } catch (err: any) {
    console.error('Update App Error:', err);
    return { success: false, message: err.message };
  }
}

// 7. Add New App Manually Action
export async function createManualApp(appData: {
  name: string;
  category: AppCategory;
  website: string;
  blockchain?: string | null;
  short_description: string;
  description: string;
  logo_url: string;
  screenshot_urls: string[];
  is_featured: boolean;
  approved: boolean;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
  wallet_address?: string | null;
}) {
  try {
    const db = await getDbClient();

    let baseSlug = slugify(appData.name);
    let finalSlug = baseSlug;

    // Check slug collision
    const { data: existingApp } = await db
      .from('apps')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();

    if (existingApp) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const { error } = await db
      .from('apps')
      .insert({
        name: appData.name,
        slug: finalSlug,
        logo_url: appData.logo_url,
        screenshot_urls: appData.screenshot_urls,
        description: appData.description,
        short_description: appData.short_description,
        category: appData.category,
        website: appData.website,
        twitter: appData.twitter || null,
        telegram: appData.telegram || null,
        discord: appData.discord || null,
        blockchain: appData.blockchain || null,
        wallet_address: appData.wallet_address || null,
        approved: appData.approved,
        is_featured: appData.is_featured,
      });

    if (error) {
      throw new Error(`Failed to create app manually: ${error.message}`);
    }

    revalidatePath('/');
    revalidatePath('/apps');
    revalidatePath('/admin/apps');

    revalidatePath('/');
    revalidatePath('/apps');
    revalidatePath('/admin/apps');

    return { success: true, message: `App "${appData.name}" created manually!` };
  } catch (err: any) {
    console.error('Create Manual App Error:', err);
    return { success: false, message: err.message };
  }
}

// 8. Upload File Helper for Admin manual creation
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

// 9. Manual App Creation with file uploads
export async function createManualAppWithFiles(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const short_description = formData.get('short_description') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as AppCategory;
    const website = formData.get('website') as string;
    const twitter = formData.get('twitter') as string || null;
    const telegram = formData.get('telegram') as string || null;
    const discord = formData.get('discord') as string || null;
    const blockchain = formData.get('blockchain') as string || null;
    const wallet_address = formData.get('wallet_address') as string || null;
    const approved = formData.get('approved') === 'true';
    const is_featured = formData.get('is_featured') === 'true';

    // Validation
    if (!name || name.trim().length < 2) return { success: false, message: 'App Name must be at least 2 characters.' };
    if (!short_description || short_description.trim().length < 10) return { success: false, message: 'Short description must be at least 10 characters.' };
    if (!description || description.trim().length < 30) return { success: false, message: 'Full description must be at least 30 characters.' };
    if (!website || !website.startsWith('http')) return { success: false, message: 'Website must be a valid URL starting with http:// or https://' };

    const logoFile = formData.get('logo') as File;
    if (!logoFile || logoFile.size === 0) return { success: false, message: 'App Logo image file is required.' };

    const screenshots = formData.getAll('screenshots') as File[];
    const validScreenshots = screenshots.filter(f => f.size > 0);
    if (validScreenshots.length === 0) return { success: false, message: 'At least one screenshot is required.' };

    // Upload
    const logoUrl = await uploadFile(logoFile, 'logos');
    const screenshotUrls: string[] = [];
    for (const f of validScreenshots) {
      screenshotUrls.push(await uploadFile(f, 'screenshots'));
    }

    // Call manual insert
    return await createManualApp({
      name,
      category,
      website,
      blockchain,
      short_description,
      description,
      logo_url: logoUrl,
      screenshot_urls: screenshotUrls,
      is_featured,
      approved,
      twitter,
      telegram,
      discord,
      wallet_address,
    });
  } catch (err: any) {
    console.error('Manual App Creation Error:', err);
    return { success: false, message: err.message || 'An unexpected error occurred.' };
  }
}

// 10. Update App Details with Files Action
export async function updateAppWithFiles(prevState: any, formData: FormData) {
  try {
    const appId = formData.get('id') as string;
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as AppCategory;
    const website = formData.get('website') as string;
    const blockchain = formData.get('blockchain') as string || null;
    const short_description = formData.get('short_description') as string;
    const description = formData.get('description') as string;
    const is_featured = formData.get('is_featured') === 'true';
    const approved = formData.get('approved') === 'true';
    const twitter = formData.get('twitter') as string || null;
    const telegram = formData.get('telegram') as string || null;
    const discord = formData.get('discord') as string || null;

    if (!appId) return { success: false, message: 'App ID is required.' };
    if (!name || name.trim().length < 2) return { success: false, message: 'App Name must be at least 2 characters.' };
    if (!slug || slug.trim().length < 2) return { success: false, message: 'Slug must be at least 2 characters.' };
    if (!short_description || short_description.trim().length < 10) return { success: false, message: 'Short description must be at least 10 characters.' };
    if (!description || description.trim().length < 30) return { success: false, message: 'Full description must be at least 30 characters.' };
    if (!website || !website.startsWith('http')) return { success: false, message: 'Website must be a valid URL.' };

    const db = await getDbClient();

    // 1. Handle Logo (if a new file is uploaded, upload it; otherwise use the existing URL)
    let logoUrl = formData.get('logo_url') as string;
    const logoFile = formData.get('logo') as File;
    if (logoFile && logoFile.size > 0) {
      if (logoFile.size > 2 * 1024 * 1024) return { success: false, message: 'Logo file size cannot exceed 2MB.' };
      logoUrl = await uploadFile(logoFile, 'logos');
    }

    // 2. Handle Screenshots
    // Retrieve remaining screenshots (which were not deleted by admin in the UI)
    const existingScreenshotsJson = formData.get('existing_screenshots') as string;
    let screenshotUrls: string[] = [];
    if (existingScreenshotsJson) {
      try {
        screenshotUrls = JSON.parse(existingScreenshotsJson);
      } catch (err) {
        console.error('Failed to parse existing screenshots:', err);
      }
    }

    // Upload any new screenshots
    const newScreenshots = formData.getAll('screenshots') as File[];
    const validNewScreenshots = newScreenshots.filter(f => f.size > 0);
    for (const f of validNewScreenshots) {
      if (f.size > 5 * 1024 * 1024) return { success: false, message: 'Screenshots cannot exceed 5MB each.' };
      const url = await uploadFile(f, 'screenshots');
      screenshotUrls.push(url);
    }

    if (screenshotUrls.length === 0) {
      return { success: false, message: 'At least one screenshot is required.' };
    }

    // 3. Update the database record
    const { error } = await db
      .from('apps')
      .update({
        name,
        slug,
        logo_url: logoUrl,
        screenshot_urls: screenshotUrls,
        description,
        short_description,
        category,
        website,
        twitter,
        telegram,
        discord,
        blockchain,
        approved,
        is_featured,
      })
      .eq('id', appId);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // 4. Revalidate cache
    revalidatePath('/');
    revalidatePath('/apps');
    revalidatePath(`/app/${slug}`);
    revalidatePath('/admin/apps');

    return { success: true, message: 'Application details updated successfully!' };
  } catch (err: any) {
    console.error('Update App Error:', err);
    return { success: false, message: err.message || 'An unexpected error occurred.' };
  }
}

