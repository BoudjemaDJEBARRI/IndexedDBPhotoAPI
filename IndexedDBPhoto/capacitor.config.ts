import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.test222.monapp',
  appName: 'IndexedDBPhoto',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
