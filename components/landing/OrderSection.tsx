"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useState, FormEvent } from 'react';
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import axios from 'axios';

export function OrderSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    deliveryMode: 'delivery',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDeliveryModeChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMode: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Créer la commande dans notre système de suivi
      const orderResponse = await axios.post('/api/orders', { formData }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const orderData = orderResponse.data;
      
      // 2. Envoyer l'email avec les détails de la commande
      const emailResponse = await axios.post('/api/send-order-email', {
        to: 'ismajesuis@live.fr',
        formData: {
          ...formData,
          orderNumber: orderData.order_number // Inclure le numéro de commande dans l'email
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Afficher une notification de succès
      toast({
        title: "Commande enregistrée",
        description: "Votre commande a été créée avec succès!",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        quantity: 1,
        deliveryMode: 'delivery',
        address: '',
        notes: ''
      });
      
      // Rediriger vers la page de confirmation avec le numéro de commande
      router.push(`/orders/${orderData.order_number}`);
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Erreur",
        description: axios.isAxiosError(error)
          ? error.response?.data?.error || "Un problème est survenu lors du traitement de votre commande. Veuillez réessayer."
          : "Un problème est survenu lors du traitement de votre commande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-16 bg-orange-600">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Commander
          </h2>
          <p className="text-gray-600 text-center mb-8">Commandez votre lahmacun fait maison</p>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nom</Label>
                  <Input 
                    id="name" 
                    placeholder="Votre nom" 
                    className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Votre email"
                    className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Votre numéro"
                    className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">Quantité</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    defaultValue="1"
                    className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Mode de Livraison</Label>
                  <RadioGroup.Root 
                    defaultValue="delivery" 
                    className="space-y-3"
                    aria-label="Mode de livraison"
                    value={formData.deliveryMode}
                    onValueChange={handleDeliveryModeChange}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroup.Item 
                        value="delivery" 
                        id="delivery"
                        className="w-5 h-5 rounded-full border border-gray-300 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-white" />
                      </RadioGroup.Item>
                      <Label htmlFor="delivery" className="font-medium cursor-pointer">Livraison à Domicile</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroup.Item 
                        value="pickup" 
                        id="pickup"
                        className="w-5 h-5 rounded-full border border-gray-300 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-white" />
                      </RadioGroup.Item>
                      <Label htmlFor="pickup" className="font-medium cursor-pointer">À Emporter</Label>
                    </div>
                  </RadioGroup.Root>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Adresse (si livraison)</Label>
                  <Input 
                    id="address" 
                    placeholder="Votre adresse"
                    className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    value={formData.address}
                    onChange={handleInputChange}
                    required={formData.deliveryMode === 'delivery'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Notes Spéciales</Label>
                  <Input 
                    id="notes" 
                    placeholder="Instructions particulières"
                    className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div id="order-button" className="pt-6 text-center">
              <Button 
                type="submit"
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto min-w-[200px] text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Commander Maintenant'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
} 