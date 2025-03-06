import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateOrderNumber } from '@/utils/order';
import { OrderStatus } from '@/utils/orderStatus';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formData } = body;

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

    // Générer un numéro de commande unique (ORDER-XXX)
    const orderNumber = await generateOrderNumber();

    // Créer une nouvelle commande avec les données du client
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: OrderStatus.PENDING,
        customer_data: formData
          ? {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              deliveryMode: formData.deliveryMode,
              address: formData.address,
              quantity: formData.quantity
            }
          : null
      })
      .select('id, order_number')
      .single();

    if (error) {
      console.error('Erreur lors de la création de la commande:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la commande' },
      { status: 500 }
    );
  }
}
