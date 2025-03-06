'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

// Types
interface Order {
  id: string;
  order_number: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer_data: {
    name: string;
    email: string;
    phone: string;
    deliveryMode: string;
    address?: string;
    quantity: number;
  } | null;
}

// Statuts et leurs couleurs
const statusConfig = {
  'en_attente_de_preparation': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  'en_preparation': { label: 'En préparation', color: 'bg-orange-100 text-orange-800' },
  'prete_a_etre_recuperee': { label: 'Prête', color: 'bg-green-100 text-green-800' },
  'en_livraison': { label: 'En livraison', color: 'bg-blue-100 text-blue-800' },
  'livree': { label: 'Livrée', color: 'bg-gray-100 text-gray-800' }
};

export default function OrdersDataTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const supabase = createClient();

  // Charger les commandes
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      applyFilters(data || [], statusFilter, searchQuery);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Mettre à jour l'état local
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      applyFilters(updatedOrders, statusFilter, searchQuery);
      
      toast({
        title: 'Statut mis à jour',
        description: `La commande a été mise à jour avec succès`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  };

  // Filtrer les commandes
  const applyFilters = (ordersList: Order[], status: string, query: string) => {
    let filtered = [...ordersList];
    
    // Filtre par statut
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }
    
    // Filtre par recherche (numéro de commande, nom, email)
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(lowercaseQuery) ||
        order.customer_data?.name?.toLowerCase().includes(lowercaseQuery) ||
        order.customer_data?.email?.toLowerCase().includes(lowercaseQuery) ||
        order.customer_data?.phone?.includes(query)
      );
    }
    
    setFilteredOrders(filtered);
  };

  // Effet pour charger les commandes au montage
  useEffect(() => {
    fetchOrders();
    
    // S'abonner aux changements en temps réel
    const subscription = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          fetchOrders();
        }
      )
      .subscribe();
    
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Effet pour appliquer les filtres
  useEffect(() => {
    applyFilters(orders, statusFilter, searchQuery);
  }, [statusFilter, searchQuery]);

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Déterminer le prochain statut
  const getNextStatus = (currentStatus: string) => {
    const statusFlow = [
      'en_attente_de_preparation',
      'en_preparation',
      'prete_a_etre_recuperee',
      'en_livraison',
      'livree'
    ];
    
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    // Si le statut actuel est le dernier ou n'est pas trouvé, retourner le même statut
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return currentStatus;
    }
    
    // Sinon, retourner le statut suivant
    return statusFlow[currentIndex + 1];
  };
  
  // Vérifier si le statut suivant est pertinent (pour la livraison)
  const isNextStatusRelevant = (order: Order, nextStatus: string) => {
    // Si le mode n'est pas livraison et que le statut suivant est lié à la livraison
    if (order.customer_data?.deliveryMode !== 'delivery' && 
        (nextStatus === 'en_livraison' || nextStatus === 'livree')) {
      return false;
    }
    return true;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Commandes</CardTitle>
            <CardDescription>
              Gérez toutes les commandes de vos clients
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusConfig).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchOrders}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Numéro</TableHead>
                <TableHead className="min-w-[150px]">Client</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Afficher des squelettes pendant le chargement
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucune commande trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                  const nextStatus = getNextStatus(order.status);
                  const canProgress = order.status !== 'livree' && 
                                      isNextStatusRelevant(order, nextStatus);
                  
                  return (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b"
                    >
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{order.customer_data?.name || 'Non disponible'}</span>
                          <span className="text-xs text-muted-foreground">
                            {order.customer_data?.phone || 'Pas de téléphone'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.customer_data?.deliveryMode === 'delivery' ? 'default' : 'outline'}>
                          {order.customer_data?.deliveryMode === 'delivery' ? 'Livraison' : 'À emporter'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={statusInfo?.color}>
                          {statusInfo?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={`/dashboard/${order.id}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Voir</span>
                            </Link>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!canProgress}
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                          >
                            {statusConfig[nextStatus as keyof typeof statusConfig]?.label || 'Mise à jour'}
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 