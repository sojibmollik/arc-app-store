import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Server-side client using cookies (respects RLS)
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method can be called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

// Admin client using service role key (bypasses RLS)
// Note: Only call this within server-side environments (Server Actions, Route Handlers, Server Components)
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const useFallback = !serviceKey || serviceKey === 'your-service-role-key' || serviceKey === '';
  
  if (useFallback) {
    console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is not configured. Falling back to ANON key.');
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    useFallback ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// Dynamic database client resolver:
// Returns RLS-bypassing admin client if Service Role Key is configured, 
// otherwise returns the user-session client (respects RLS, works via authenticated policies).
export async function getDbClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasServiceKey = serviceKey && serviceKey !== 'your-service-role-key' && serviceKey !== '';
  
  if (hasServiceKey) {
    return createAdminClient();
  }
  
  return await createClient();
}
