'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface OrderNotesProps {
  initialNotes: string;
  orderId: string;
  canEdit: boolean;
}

/**
 * Composant permettant d'afficher et de modifier les notes d'une commande
 * Les notes ne peuvent être modifiées que si canEdit est true (statut ≠ en_preparation)
 */
export default function OrderNotes({ 
  initialNotes, 
  orderId, 
  canEdit 
}: OrderNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  /**
   * Envoie les notes mises à jour à l'API
   */
  async function saveNotes() {
    if (!canEdit) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour des notes');
      }
      
      toast({
        title: 'Notes sauvegardées',
        description: 'Vos notes ont été mises à jour avec succès.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
        disabled={!canEdit || isLoading}
        placeholder={canEdit 
          ? "Ajoutez des notes sur votre commande..." 
          : "Les notes ne sont pas modifiables pour le moment"}
        className="min-h-[100px] resize-none"
      />
      
      {canEdit && (
        <Button 
          onClick={saveNotes} 
          disabled={isLoading || notes === initialNotes}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder les notes'}
        </Button>
      )}
    </div>
  );
} 