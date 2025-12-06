import { logMessage } from '@/lib/monitoring';

const PAYMENT_AMOUNT = 0.01; // USDC
const PAYMENT_KEY = 'flappy_bird_payment_made';

/**
 * Simple payment service for game access
 */
export class PaymentService {
  /**
   * Check if user has paid
   */
  static hasPaid(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const paid = localStorage.getItem(PAYMENT_KEY);
      return paid === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Mark payment as completed
   */
  static markAsPaid(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(PAYMENT_KEY, 'true');
      logMessage('Payment completed', 'info', {
        component: 'PaymentService',
        metadata: { amount: PAYMENT_AMOUNT },
      });
    } catch (error) {
      console.error('Failed to save payment status:', error);
    }
  }

  /**
   * Get payment amount
   */
  static getPaymentAmount(): number {
    return PAYMENT_AMOUNT;
  }

  /**
   * Reset payment (for testing)
   */
  static resetPayment(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(PAYMENT_KEY);
    } catch (error) {
      console.error('Failed to reset payment:', error);
    }
  }
}
