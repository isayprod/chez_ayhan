/**
 * Classe utilitaire pour gérer les statuts de commande
 * Centralise toutes les valeurs de statut pour faciliter la maintenance
 */
export class OrderStatus {
  // Valeurs des statuts
  static readonly PENDING = 'pending';
  static readonly PREPARING = 'preparing';
  static readonly READY = 'ready_pickup';
  static readonly DELIVERING = 'delivering';
  static readonly DELIVERED = 'delivered';

  // Méthode pour obtenir tous les statuts sous forme de tableau
  static getAllStatuses(): string[] {
    return [
      this.PENDING,
      this.PREPARING,
      this.READY,
      this.DELIVERING,
      this.DELIVERED
    ];
  }

  static getDeliveryStatusesInclusive(): string[] {
    return [...this.getPreparationStatuses(), ...this.getDeliveryStatuses()];
  }

  static getPickupStatusesInclusive(): string[] {
    return [...this.getPreparationStatuses(), ...this.getPickupStatueses()];
  }

  static getPreparationStatuses(): string[] {
    return [this.PENDING, this.PREPARING];
  }

  static getPickupStatueses(): string[] {
    return [this.READY];
  }

  static getDeliveryStatuses(): string[] {
    return [this.DELIVERING, this.DELIVERED];
  }

  static isDeliveryStatus(status: string): boolean {
    return this.getDeliveryStatuses().includes(status);
  }

  static isDeliveryStatusInclusive(status: string): boolean {
    return this.getDeliveryStatusesInclusive().includes(status);
  }

  static isPickupStatus(status: string): boolean {
    return this.getPickupStatueses().includes(status);
  }

  static isPickupStatusInclusive(status: string): boolean {
    return this.getPickupStatusesInclusive().includes(status);
  }

  static isRelevantStatus(status: string, isDelivery: boolean): boolean {
    return isDelivery
      ? this.isDeliveryStatusInclusive(status)
      : this.isPickupStatusInclusive(status);
  }

  static getNextStatus(
    currentStatus: string,
    isDelivery: boolean = true
  ): string {
    const statuses = isDelivery
      ? this.getDeliveryStatusesInclusive()
      : this.getPickupStatusesInclusive();

    const currentIndex = statuses.indexOf(currentStatus);

    // Si le statut n'est pas valide ou c'est le dernier, retourner le statut actuel
    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      return currentStatus;
    }

    return statuses[currentIndex + 1];
  }

  // Obtenir le libellé d'un statut
  static getLabel(status: string): string {
    const labels: Record<string, string> = {
      [this.PENDING]: 'En attente',
      [this.PREPARING]: 'En préparation',
      [this.READY]: 'Prête à être récupérée',
      [this.DELIVERING]: 'En livraison',
      [this.DELIVERED]: 'Livrée'
    };

    return labels[status] || status;
  }

  // Obtenir le libellé court d'un statut
  static getShortLabel(status: string): string {
    const labels: Record<string, string> = {
      [this.PENDING]: 'En attente',
      [this.PREPARING]: 'En préparation',
      [this.READY]: 'Prête',
      [this.DELIVERING]: 'En livraison',
      [this.DELIVERED]: 'Livrée'
    };

    return labels[status] || status;
  }

  // Obtenir la couleur d'un statut (classes Tailwind)
  static getColor(status: string): string {
    const colors: Record<string, string> = {
      [this.PENDING]: 'bg-yellow-100 text-yellow-800',
      [this.PREPARING]: 'bg-orange-100 text-orange-800',
      [this.READY]: 'bg-green-100 text-green-800',
      [this.DELIVERING]: 'bg-blue-100 text-blue-800',
      [this.DELIVERED]: 'bg-gray-100 text-gray-800'
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
