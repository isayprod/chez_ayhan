'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LockIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Appel à une API pour vérifier le mot de passe
      const response = await axios.post('/api/admin/login', { password }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans l\'interface d\'administration',
        variant: 'default',
      });
      
      // Rediriger vers le tableau de bord
      router.push('/admin/orders');
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: axios.isAxiosError(error) 
          ? error.response?.data?.error || 'Mot de passe incorrect'
          : error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <LockIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Administration</CardTitle>
            <CardDescription className="text-center">
              Accédez au tableau de bord de gestion des commandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full"
                  placeholder="Entrez le mot de passe administrateur"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Cette zone est réservée aux administrateurs
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
} 