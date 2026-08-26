import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agririsk.app',
  appName: 'AgriRisk',
  webDir: 'out',
  server: {
    url: 'https://agri-risk1.vercel.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      showSpinner: false
    }
  }
};

export default config;
