import { Network, ConnectionStatus } from '@capacitor/network';
import { capacitorBridge } from './capacitorBridge';

export interface NetworkState {
  connected: boolean;
  connectionType: string;
}

export const networkAdapter = {
  /**
   * Get current network status
   */
  async getStatus(): Promise<NetworkState> {
    if (capacitorBridge.isNative()) {
      try {
        const status = await Network.getStatus();
        return {
          connected: status.connected,
          connectionType: status.connectionType
        };
      } catch (err) {
        console.warn('Native Network status query failed:', err);
      }
    }

    return {
      connected: navigator.onLine,
      connectionType: 'browser'
    };
  },

  /**
   * Listen for network status changes
   */
  addListener(callback: (state: NetworkState) => void): () => void {
    if (capacitorBridge.isNative()) {
      const handle = Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
        callback({
          connected: status.connected,
          connectionType: status.connectionType
        });
      });

      return () => {
        handle.then(h => h.remove());
      };
    }

    const onOnline = () => callback({ connected: true, connectionType: 'wifi' });
    const onOffline = () => callback({ connected: false, connectionType: 'none' });

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
};
