import { createClient } from '@supabase/supabase-js';

// Vérifier les variables d'environnement requises
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

// Client Supabase côté client (permissions limitées)
export function createSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Client Supabase côté serveur (permissions étendues)
export function createSupabaseAdmin() {
  // Pour les API routes et serveur uniquement
  if (!process.env.SUPABASE_SERVICE_KEY) {
    // Fallback à la clé anonyme si la clé de service n'est pas disponible
    console.warn(
      'SUPABASE_SERVICE_KEY non définie, utilisation de la clé anonyme'
    );
    return createSupabaseClient();
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}
