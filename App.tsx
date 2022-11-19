import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import * as Crypto from 'expo-crypto';
import { osBuildFingerprint } from 'expo-device';
import React from 'react';
import { API } from './lib/api.service';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    Notifications.getExpoPushTokenAsync().then(console.log);

    const login = async () => {
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        osBuildFingerprint || 'IOS FUCK YOU',
      );
      API.login(token, 'DamirLut');
    };

    login();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <RecoilRoot>
        <RecoilNexus />
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </RecoilRoot>
    );
  }
}
