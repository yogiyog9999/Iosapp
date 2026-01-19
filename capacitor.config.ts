import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.dlist',
  appName: 'D List',
  webDir: 'www',

  server: {
    androidScheme: 'https'
  },

  android: {
    adjustMarginsForEdgeToEdge: 'auto'
  },

  plugins: {
    App: {
      scheme: 'dlist'
    },

    StatusBar: {
      overlaysWebView: true
    },

    SplashScreen: {
  launchShowDuration: 0,        // 🔥 IMPORTANT
  launchAutoHide: false,
  backgroundColor: "#ffffff",
  darkModeBackgroundColor: "#ffffff",
  androidSplashResourceName: "splash",
  androidScaleType: "CENTER_CROP",
  showSpinner: false
}
  }
};

export default config;
