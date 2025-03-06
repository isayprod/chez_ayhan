export class ModeStatus {
  static readonly DELIVERY = 'delivery';
  static readonly PICKUP = 'pickup';

  static getAllModes(): string[] {
    return [this.DELIVERY, this.PICKUP];
  }

  static isDeliveryMode(mode: string): boolean {
    return mode === this.DELIVERY;
  }

  static isPickupMode(mode: string): boolean {
    return mode === this.PICKUP;
  }

  static getShortLabel(mode: string): string {
    return mode === this.DELIVERY ? 'Livraison' : 'À emporter';
  }

  static getColor(mode: string): string {
    return mode === this.DELIVERY ? 'bg-blue-500' : 'bg-green-500';
  }

  static getLabel(mode: string): string {
    return mode === this.DELIVERY ? 'Livraison' : 'À emporter';
  }
}
