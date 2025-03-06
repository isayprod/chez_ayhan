'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const settingsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  adminEmail: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  preparationTime: z.string().regex(/^\d+$/, {
    message: 'Le temps de préparation doit être un nombre entier.',
  }),
  allowNotesAfterPreparation: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Valeurs par défaut
const defaultValues: Partial<SettingsFormValues> = {
  emailNotifications: true,
  adminEmail: 'admin@lahmacun.fr',
  preparationTime: '30',
  allowNotesAfterPreparation: false,
};

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    
    // Simuler un délai réseau
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Paramètres mis à jour',
        description: 'Vos paramètres ont été enregistrés avec succès.',
      });
      console.log('Settings data:', data);
    }, 1000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres généraux de l'application
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>
            Configurez les paramètres de base pour le système de commande.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email administrateur</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Les notifications seront envoyées à cette adresse.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preparationTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temps de préparation (minutes)</FormLabel>
                      <FormControl>
                        <Input placeholder="30" {...field} />
                      </FormControl>
                      <FormDescription>
                        Temps moyen de préparation d'une commande
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notifications par email</FormLabel>
                        <FormDescription>
                          Recevoir des emails pour chaque nouvelle commande
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allowNotesAfterPreparation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notes après préparation</FormLabel>
                        <FormDescription>
                          Permettre aux clients d'ajouter des notes après que la préparation ait commencé
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-end p-0">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
} 