import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { OrderStatus } from '@/utils/orderStatus';

// Schéma de validation pour la mise à jour des notes
const updateSchema = z.object({
  notes: z.string().optional()
});

/**
 * Récupérer les détails d'une commande par UUID
 */
export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          }
        }
      }
    );

    // Récupérer la commande par UUID
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.uuid)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      {
        error: 'Une erreur est survenue lors de la récupération de la commande'
      },
      { status: 500 }
    );
  }
}

/**
 * Mettre à jour les notes d'une commande
 * Les notes ne peuvent être modifiées que si la commande n'est pas en préparation
 */
export async function PATCH(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          }
        }
      }
    );

    // Vérifier le statut actuel de la commande
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', params.uuid)
      .single();

    if (orderError) {
      console.error('Erreur lors de la vérification du statut:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 404 });
    }

    // Empêcher la modification si la commande est en préparation
    if (orderData?.status === OrderStatus.PREPARING) {
      return NextResponse.json(
        { error: 'Impossible de modifier les notes pendant la préparation' },
        { status: 403 }
      );
    }

    // Valider les données de la requête
    const body = await request.json();
    try {
      const validatedData = updateSchema.parse(body);

      // Mettre à jour les notes
      const { data, error } = await supabase
        .from('orders')
        .update(validatedData)
        .eq('id', params.uuid)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour des notes:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    } catch (validationError) {
      console.error('Erreur de validation:', validationError);
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      {
        error: 'Une erreur est survenue lors de la mise à jour de la commande'
      },
      { status: 500 }
    );
  }
}
