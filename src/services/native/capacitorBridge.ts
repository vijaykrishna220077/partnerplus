import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const capacitorBridge = {
  /**
   * Returns true if running inside native Capacitor environment (Android/iOS)
   */
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  },

  /**
   * Returns true if running on Android native
   */
  isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  },

  /**
   * Returns current platform identifier ('android' | 'ios' | 'web')
   */
  getPlatform(): string {
    return Capacitor.getPlatform();
  },

  /**
   * Initialize native mobile UI settings on app startup
   */
  async initializeNativeApp(onHardwareBack?: () => boolean): Promise<void> {
    if (!this.isNative()) return;

    try {
      // 1. Hide splash screen smoothly after React DOM mounts
      await SplashScreen.hide();

      // 2. Configure dark status bar styling
      await StatusBar.setStyle({ style: Style.Dark });
      if (this.isAndroid()) {
        await StatusBar.setBackgroundColor({ color: '#0f172a' });
      }
    } catch (err) {
      console.warn('Native status bar / splash screen init warning:', err);
    }

    // 3. Register Android hardware Back button handler
    if (this.isAndroid()) {
      App.addListener('backButton', ({ canGoBack }) => {
        if (onHardwareBack) {
          const handled = onHardwareBack();
          if (handled) return;
        }

        if (canGoBack) {
          window.history.back();
        } else {
          // Minimize app rather than force exit if on home view
          App.minimizeApp();
        }
      });
    }
  }
};
