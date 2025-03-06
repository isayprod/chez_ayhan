'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LayoutDashboard, LogOut, ClipboardList, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  // Si on est sur la page de login, ne pas afficher la barre latérale
  if (pathname === '/admin/login') {
    return (
      <main className="flex h-screen bg-gray-50">{children}</main>
    );
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/admin/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès',
        variant: 'default',
      });
      router.push('/admin/login');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: axios.isAxiosError(error)
          ? error.response?.data?.error || 'Une erreur est survenue lors de la déconnexion'
          : 'Une erreur est survenue lors de la déconnexion',
        variant: 'destructive',
      });
    }
  };

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Commandes',
      href: '/admin/orders',
      icon: ClipboardList,
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-full"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0 overflow-y-auto bg-white shadow-lg lg:static"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-center h-16 px-4 border-b">
                <h2 className="text-xl font-bold text-primary">Lahmacun Admin</h2>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors ${
                      pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {children}
      </div>
    </div>
  );
} 