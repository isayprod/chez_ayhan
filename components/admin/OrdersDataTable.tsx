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
import { RefreshCw, Search, ExternalLink, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { OrderStatus } from '@/utils/orderStatus';
import { ModeStatus } from '@/utils/modeStatus';

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

// Utilisation de la classe OrderStatus pour les configurations de statut
const statusConfig = {
  [OrderStatus.PENDING]: { 
    label: OrderStatus.getShortLabel(OrderStatus.PENDING), 
    color: OrderStatus.getColor(OrderStatus.PENDING) 
  },
  [OrderStatus.PREPARING]: { 
    label: OrderStatus.getShortLabel(OrderStatus.PREPARING), 
    color: OrderStatus.getColor(OrderStatus.PREPARING)
  },
  [OrderStatus.READY]: { 
    label: OrderStatus.getShortLabel(OrderStatus.READY), 
    color: OrderStatus.getColor(OrderStatus.READY)
  },
  [OrderStatus.DELIVERING]: { 
    label: OrderStatus.getShortLabel(OrderStatus.DELIVERING), 
    color: OrderStatus.getColor(OrderStatus.DELIVERING)
  },
  [OrderStatus.DELIVERED]: { 
    label: OrderStatus.getShortLabel(OrderStatus.DELIVERED), 
    color: OrderStatus.getColor(OrderStatus.DELIVERED)
  }
};

const modeConfig = {
  [ModeStatus.DELIVERY]: {
    label: ModeStatus.getShortLabel(ModeStatus.DELIVERY),
    color: ModeStatus.getColor(ModeStatus.DELIVERY)
  },
  [ModeStatus.PICKUP]: {
    label: ModeStatus.getShortLabel(ModeStatus.PICKUP),
    color: ModeStatus.getColor(ModeStatus.PICKUP)
  }
};

export default function OrdersDataTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
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
      applyFilters(data || [], statusFilter, modeFilter, searchQuery);
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
      applyFilters(updatedOrders, statusFilter, modeFilter, searchQuery);
      
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
  const applyFilters = (ordersList: Order[], status: string, mode: string, query: string) => {
    let filtered = [...ordersList];
    
    // Filtre par statut
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Filtre par mode
    if (mode !== 'all') {
      filtered = filtered.filter(order => order.customer_data?.deliveryMode === mode);
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
    applyFilters(orders, statusFilter, modeFilter, searchQuery);
  }, [statusFilter, modeFilter, searchQuery]);

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
              value={modeFilter}
              onValueChange={(value) => setModeFilter(value)}
            >
              <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Tous les modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les modes</SelectItem>
                {Object.entries(modeConfig).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px] focus:ring-1 focus:ring-offset-1">
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
                  const nextStatus = OrderStatus.getNextStatus(order.status);
                  const canProgress = order.status != 'delivered' && OrderStatus.isRelevantStatus(nextStatus, order.customer_data?.deliveryMode === 'delivery');
                  
                  return (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b"
                    >
                      <TableCell className="font-semibold">
                        {(() => {
                          // Get the numeric part of the order number
                          const currentNum = parseInt(order.order_number.split('-')[1]);
                          const maxNum = Math.max(...filteredOrders.map(o => parseInt(o.order_number.split('-')[1])));
                          
                          // Calculate opacity based on position from latest order
                          const diff = maxNum - currentNum;
                          if (diff >= 5) {
                            return <span className="opacity-100">{order.order_number}</span>;
                          }
                          
                          // Create gradient for 5 most recent orders (20% steps)
                          const opacity = 0.2 + ((4 - diff) * 0.3);
                          return <span style={{ opacity }}>{order.order_number}</span>;
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{order.customer_data?.name || 'Non disponible'}</span>
                          {order.customer_data?.deliveryMode === 'delivery' ? (
                            <a 
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customer_data?.address || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <MapPin className="h-3 w-3" />
                              {order.customer_data?.address || 'Pas d\'adresse'}
                            </a>
                          ) : (
                            <a
                              href={`tel:${order.customer_data?.phone}`}
                              className="text-xs text-muted-foreground hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" />
                              {order.customer_data?.phone || 'Pas de téléphone'}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.customer_data?.deliveryMode === 'delivery' ? 'default' : 'outline'}>
                          {order.customer_data?.deliveryMode === 'delivery' ? 'Livraison' : 'À emporter'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={`${statusInfo?.color} pointer-events-none`}>
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