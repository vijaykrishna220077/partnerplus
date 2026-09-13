import { PushNotifications, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { capacitorBridge } from './capacitorBridge';

export const notificationAdapter = {
  /**
   * Initialize and register for Android native push notifications
   */
  async registerPushNotifications(onNotificationTap?: (notification: PushNotificationSchema) => void): Promise<boolean> {
    if (!capacitorBridge.isNative()) return false;

    try {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission denied on Android');
        return false;
      }

      await PushNotifications.register();

      // Listen for registration token
      PushNotifications.addListener('registration', (token) => {
        console.log('Android Push Registration Token:', token.value);
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (err) => {
        console.warn('Android Push Registration Error:', err.error);
      });

      // Listen for notifications received while app is running
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push Notification Received:', notification);
      });

      // Listen for notification tap / deep link action
      PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        if (onNotificationTap) {
          onNotificationTap(action.notification);
        }
      });

      return true;
    } catch (err) {
      console.warn('Native Push Notifications setup failed:', err);
      return false;
    }
  }
};
