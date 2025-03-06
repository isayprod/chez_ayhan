'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import OrdersDataTable from '@/components/admin/OrdersDataTable';
import { motion } from 'framer-motion';

export default function AdminOrdersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes</h1>
        <p className="text-muted-foreground">
          Visualisez, filtrez et mettez à jour le statut des commandes en temps réel.
        </p>
      </div>

      <Suspense fallback={<div className="rounded-md border p-8"><Skeleton className="h-[400px] w-full" /></div>}>
        <OrdersDataTable />
      </Suspense>
    </motion.div>
  );
} 