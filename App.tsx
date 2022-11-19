import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import * as Crypto from 'expo-crypto';
import { osBuildFingerprint } from 'expo-device';
import React from 'react';
import { API, UserService } from './lib/api.service';
import { RecoilRoot } from 'recoil';
import RecoilNexus, { setRecoil } from 'recoil-nexus';

import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

import { GeoAtom } from './store/geo.atom';

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

    const updateGeo = async () => {
      let location = await Location.getCurrentPositionAsync({});
      setRecoil(GeoAtom, {
        longitude: location.coords.longitude || 0,
        latitude: location.coords.latitude || 0,
      });

      UserService.updateGeo(location.coords.longitude, location.coords.latitude);
    };
    login();

    const interval = setInterval(updateGeo, 5000);

    return () => {
      clearInterval(interval);
    };
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
