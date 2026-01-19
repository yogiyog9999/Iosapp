import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class FirebaseAnalyticsService {

  async log(name: string, params?: any) {
    if (Capacitor.getPlatform() === 'web') return;

    await FirebaseAnalytics.logEvent({
      name,
      params: params || {}
    });
  }

  async setUserId(uid: string) {
    if (Capacitor.getPlatform() === 'web') return;

    await FirebaseAnalytics.setUserId({ userId: uid });
  }
}
