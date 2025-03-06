import { CookieOptions, createServerClient } from '@supabase/ssr';
import { createClient } from './supabase/client';
import { cookies } from 'next/headers';

// Vérifier les variables d'environnement requises
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

// Client Supabase côté serveur (permissions étendues)
export function createSupabaseServer() {
  // Pour les API routes et serveur uniquement
  if (!process.env.SUPABASE_SERVICE_KEY) {
    // Fallback à la clé anonyme si la clé de service n'est pas disponible
    console.warn(
      'SUPABASE_SERVICE_KEY non définie, utilisation de la clé anonyme'
    );
    return createClient();
  }
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        // The get method is used to retrieve a cookie by its name
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // The set method is used to set a cookie with a given name, value, and options
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // If the set method is called from a Server Component, an error may occur
            // This can be ignored if there is middleware refreshing user sessions
          }
        },
        // The remove method is used to delete a cookie by its name
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // If the remove method is called from a Server Component, an error may occur
            // This can be ignored if there is middleware refreshing user sessions
          }
        }
      }
    }
  );
}
