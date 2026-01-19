import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@capacitor/device';
import { App as CapacitorApp } from '@capacitor/app';

import { supabase } from './services/supabase.client';
import { PushService } from './services/push.service';
import { FirebaseAnalyticsService } from './services/firebase-analytics.service';

@Component({
standalone: false,
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  private sessionStart = 0;

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private pushService: PushService,
    private analytics: FirebaseAnalyticsService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    // 🔥 Wait for native platform
    await this.platform.ready();

    // 🔥 Prevent content under status bar
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#000000' });

    // 🔥 Init services
    await this.pushService.init();

    // 🔥 Analytics
    this.trackFirstOpen();
    this.sessionStart = Date.now();
    this.analytics.log('session_start');

    // 🔥 Auth check (FAST)
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth error:', error.message);
    }

    // 🔥 Navigate BEFORE hiding splash
    if (data.session) {
      this.analytics.setUserId(data.session.user.id);
      await this.navCtrl.navigateRoot('/tabs/dashboard');
    } else {
      await this.navCtrl.navigateRoot('/auth/login');
    }

    // 🔥 Hide splash LAST
    await SplashScreen.hide();
  }

  trackFirstOpen() {
    if (!localStorage.getItem('app_installed')) {
      this.analytics.log('app_install');
      localStorage.setItem('app_installed', '1');
    }
    this.analytics.log('first_open');
  }

  ngOnDestroy() {
    const duration = Math.round((Date.now() - this.sessionStart) / 1000);
    this.analytics.log('session_duration', { seconds: duration });
  }
}
