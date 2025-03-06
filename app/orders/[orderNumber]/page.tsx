'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// Fonction vide qui sera remplacée par la vraie fonction confetti côté client
const noopConfetti = () => null;

interface OrderConfirmationProps {
  params: {
    orderNumber: string;
  };
}

/**
 * Page de confirmation de commande
 * Affiche le numéro de commande et un lien vers le tableau de bord
 */
export default function OrderConfirmation({ params }: OrderConfirmationProps) {
  const [order, setOrder] = useState<{ id: string; order_number: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Importer confetti uniquement côté client
    let confettiEffect: any = noopConfetti;
    import('canvas-confetti').then(module => {
      confettiEffect = module.default;
    });
    
    async function loadOrder() {
      try {
        const supabase = createClient();
        
        // Rechercher la commande dans la base de données
        const { data, error: supabaseError } = await supabase
          .from('orders')
          .select('id, order_number')
          .eq('order_number', params.orderNumber)
          .single();
        
        if (supabaseError) throw new Error(supabaseError.message);
        
        setOrder(data);
        
        // Lancer les confettis une fois les données chargées
        setTimeout(() => {
          confettiEffect({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
        
      } catch (err) {
        console.error('Erreur lors du chargement de la commande:', err);
        setError('Impossible de charger les détails de la commande');
      } finally {
        setLoading(false);
      }
    }
    
    loadOrder();
  }, [params.orderNumber]);
  
  if (loading) {
    return (
      <div className="container max-w-md mx-auto py-12 px-4 flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <p className="text-muted-foreground text-center">Chargement des détails de votre commande...</p>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-border">
          <h1 className="text-2xl font-bold text-center mb-6 text-red-500">Erreur</h1>
          <p className="text-center">{error || 'Commande introuvable'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <motion.div 
        className="bg-white rounded-lg shadow-xl p-8 border border-border relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cercle décoratif */}
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-green-50 rounded-full z-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
      
        {/* Icône animée */}
        <motion.div 
          className="relative z-10 mb-6 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0] 
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 1],
              repeat: 0,
              delay: 1
            }}
          >
            <CheckCircle className="w-20 h-20 text-green-500" />
          </motion.div>
        </motion.div>
        
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-center mb-6">Commande Confirmée</h1>
          
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-2">Votre numéro de commande</p>
            <motion.p 
              className="text-3xl font-mono font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {order.order_number}
            </motion.p>
          </div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href={`/dashboard/${order.id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 py-2"
            >
              Suivre ma commande
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 