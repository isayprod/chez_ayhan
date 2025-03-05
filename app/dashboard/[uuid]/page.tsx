'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '@/components/ui/use-toast';
import OrderStatusTracker, { OrderStatus } from '@/components/orders/OrderStatusTracker';
import OrderNotes from '@/components/orders/OrderNotes';
import ShareQRCode from '@/components/orders/ShareQRCode';
import { motion } from 'framer-motion';

interface OrderData {
  id: string;
  order_number: string;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer_data?: {
    deliveryMode?: string;
  } | null;
}

interface DashboardProps {
  params: {
    uuid: string;
  };
}

/**
 * Page du tableau de bord de suivi de commande
 * Affiche le statut actuel, les notes et les informations de la commande
 * Supporte les mises à jour en temps réel
 */
export default function OrderDashboard({ params }: DashboardProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { toast } = useToast();

  // Fonction pour obtenir le libellé d'un statut
  const getStatusLabel = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      'en_attente_de_preparation': 'En attente de préparation',
      'en_preparation': 'En préparation',
      'prete_a_etre_recuperee': 'Prête à être récupérée',
      'en_livraison': 'En livraison',
      'livree': 'Livrée'
    };
    return statusMap[status] || status;
  };
  
  useEffect(() => {
    async function loadOrder() {
      try {
        // Charger les données de la commande
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.uuid)
          .single();
        
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        
        if (!data) {
          throw new Error('Commande introuvable');
        }
        
        setOrder(data as OrderData);
      } catch (err) {
        console.error('Erreur lors du chargement de la commande:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
    
    loadOrder();
    
    // S'abonner aux mises à jour en temps réel de la commande
    const subscription = supabase
      .channel(`order-${params.uuid}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${params.uuid}`
        },
        (payload: any) => {
          const newData = payload.new as OrderData;
          
          setOrder(prev => {
            // Si le statut a changé, afficher une notification
            if (prev && prev.status !== newData.status) {
              toast({
                title: 'Statut mis à jour!',
                description: `Votre commande est maintenant: ${getStatusLabel(newData.status)}`,
                variant: 'default',
              });
            }
            return newData;
          });
        }
      )
      .subscribe();
    
    // Nettoyer l'abonnement à la désinscription du composant
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [params.uuid, supabase, toast]);
  
  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-border animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded mt-8"></div>
        </div>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error || !order) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-border">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Erreur</h1>
          <p>{error || 'Impossible de charger les détails de la commande'}</p>
        </div>
      </div>
    );
  }
  
  // Déterminer si les notes sont modifiables (pas en préparation)
  const canEditNotes = order.status !== 'en_preparation';
  
  // Vérifier si c'est une livraison ou un retrait sur place
  const isDelivery = order.customer_data?.deliveryMode === 'delivery';
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Suivi de Commande</h1>
          
          {/* Ajout du bouton de partage QR code */}
          <div className="mt-2 sm:mt-0">
            <ShareQRCode orderUrl={typeof window !== 'undefined' ? window.location.href : ''} />
          </div>
        </div>
        
        <motion.div 
          className="mb-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Numéro de commande</p>
            <p className="font-mono font-medium">{order.order_number}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Créée le</p>
            <p>{new Date(order.created_at).toLocaleString()}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Dernière mise à jour</p>
            <p>{new Date(order.updated_at).toLocaleString()}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Mode de réception</p>
            <p className="font-medium">{isDelivery ? 'Livraison' : 'À emporter'}</p>
          </div>
        </motion.div>
        
        {/* Composant de suivi de statut */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <OrderStatusTracker 
            status={order.status} 
            isDelivery={isDelivery}
          />
        </motion.div>
        
        {/* Section des notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <OrderNotes 
            initialNotes={order.notes || ''} 
            orderId={order.id}
            canEdit={canEditNotes}
          />
          {!canEditNotes && (
            <p className="text-sm text-muted-foreground mt-2">
              Les notes ne peuvent pas être modifiées pendant la préparation
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
} 