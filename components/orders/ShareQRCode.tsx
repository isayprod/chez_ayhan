'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Share as ShareIcon } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface ShareQRCodeProps {
  orderUrl: string;
}

/**
 * Composant permettant de partager un lien de suivi de commande via QR code
 */
export default function ShareQRCode({ orderUrl }: ShareQRCodeProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  /**
   * Copie le lien dans le presse-papier
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(orderUrl);
      toast({
        title: 'Lien copié!',
        description: 'Le lien de suivi a été copié dans le presse-papier.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Erreur lors de la copie dans le presse-papier:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ShareIcon className="h-4 w-4" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partagez votre commande</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCode 
              value={orderUrl} 
              size={180}
              level="M"
              className="mb-4"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4 mb-6">
            Scannez ce code QR pour partager le lien de suivi
          </p>
          <Button
            onClick={copyToClipboard}
            className="w-full"
          >
            Copier le lien
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 