import { logMessage } from '@/lib/monitoring';

interface QueuedTransaction {
  id: string;
  type: 'high_score' | 'referral';
  data: unknown;
  timestamp: number;
  attempts: number;
}

const QUEUE_KEY = 'flappy_bird_tx_queue';
const MAX_QUEUE_SIZE = 50;
const MAX_ATTEMPTS = 3;

class OfflineManager {
  private isOnline: boolean = true;
  private queue: QueuedTransaction[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue();
      this.setupOnlineListener();
    }
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      logMessage('Network connection restored', 'info', {
        component: 'OfflineManager',
      });
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      logMessage('Network connection lost', 'warning', {
        component: 'OfflineManager',
      });
    });

    this.isOnline = navigator.onLine;
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load transaction queue:', error);
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save transaction queue:', error);
    }
  }

  /**
   * Queue a transaction for later submission
   */
  queueTransaction(type: QueuedTransaction['type'], data: unknown): string {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const transaction: QueuedTransaction = {
      id,
      type,
      data,
      timestamp: Date.now(),
      attempts: 0,
    };

    this.queue.push(transaction);

    // Limit queue size
    if (this.queue.length > MAX_QUEUE_SIZE) {
      this.queue = this.queue.slice(-MAX_QUEUE_SIZE);
    }

    this.saveQueue();

    logMessage(`Transaction queued: ${type}`, 'info', {
      component: 'OfflineManager',
      metadata: { id, type },
    });

    return id;
  }

  /**
   * Process queued transactions
   */
  async processQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    const toProcess = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const transaction of toProcess) {
      try {
        await this.processTransaction(transaction);
      } catch {
        transaction.attempts++;

        if (transaction.attempts < MAX_ATTEMPTS) {
          // Re-queue if not exceeded max attempts
          this.queue.push(transaction);
        } else {
          logMessage(
            `Transaction failed after ${MAX_ATTEMPTS} attempts`,
            'error',
            {
              component: 'OfflineManager',
              metadata: { transaction },
            }
          );
        }
      }
    }

    this.saveQueue();
  }

  private async processTransaction(transaction: QueuedTransaction) {
    // This will be implemented when blockchain service is ready
    // For now, just log
    logMessage(`Processing transaction: ${transaction.type}`, 'info', {
      component: 'OfflineManager',
      metadata: { transaction },
    });
  }

  /**
   * Check if online
   */
  getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Clear queue
   */
  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

export const offlineManager = new OfflineManager();
