# Supabase Setup Guide - Arc App Store (Updated)

Follow these steps to set up your Supabase project for the Arc App Store.

---

## 1. Setup Database Tables & Security Policies

If you already created the tables from the previous version, please drop them first before running the updated schema:

1. Open your **[Supabase Dashboard](https://supabase.com/dashboard/)** and go to your project.
2. Click on the **SQL Editor** in the left sidebar.
3. Click **New Query** and execute:
   ```sql
   drop table if exists public.apps cascade;
   drop table if exists public.submissions cascade;
   ```
4. Copy the entire contents of [schema.sql](file:///e:/arc/arcappstore/schema.sql) and paste it into the editor.
5. Click **Run**.
6. This will recreate the `apps` and `submissions` tables with the updated schema columns (`website`, `twitter`, `telegram`, `discord`, `approved`) and configure row-level security (RLS) so that the public only has access to apps where `approved = true`.

---

## 2. Set Up Storage Bucket

We need a storage bucket to store app logos and screenshots.

1. In the left sidebar, click on **Storage**.
2. Click **New Bucket**.
3. Name the bucket: `arc-app-store`.
4. Toggle **Public** to **ON** (very important, so assets can be retrieved publicly).
5. Click **Save**.

### Configure Storage Policies

To allow public reads but secure writes, navigate to your bucket settings and define the following policies:

1. **Policy 1: Allow public read-only access**:
   - **Allowed operations**: `SELECT`
   - **Target Roles**: `public`
   - **Condition**: `true` (default)
2. **Policy 2: Allow admin/service role uploads**:
   - Our server actions handle the upload process, so no open anonymous insert policy is required if you configure the service role key. 
   - If you want standard uploads to work without the service role key, add an upload policy:
     - **Allowed operations**: `INSERT`, `UPDATE`, `DELETE`
     - **Target Roles**: `authenticated` (admin authenticated users)
     - **Condition**: `bucket_id = 'arc-app-store'`

---

## 3. Create Admin Account

To sign in to the administrative console:

1. Click on **Authentication** in the left sidebar of your Supabase Dashboard.
2. Click **Add User** > **Create User**.
3. Enter the email and password for your administrator profile.
4. Toggle **Auto-confirm User?** to **ON** to bypass email confirmation checks.
5. Click **Save**.

---

## 4. Add Environment Variables to .env.local / Vercel

Copy the API keys from **Project Settings > API** in Supabase and paste them into your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Service role key provides RLS bypass.
# If left blank or empty, the app will gracefully fall back to using your admin user cookie session.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
