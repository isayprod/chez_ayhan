import { createSupabaseAdmin } from './supabase';

/**
 * Génère un numéro de commande au format ORDER-XXX
 * en fonction du nombre de commandes existantes
 */
export async function generateOrderNumber() {
  const supabase = createSupabaseAdmin();

  // Obtenir le nombre total de commandes
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const orderNum = (count || 0) + 1;

  // Formater avec des zéros (ORDER-001, ORDER-002, etc.)
  return `ORDER-${orderNum.toString().padStart(3, '0')}`;
}
