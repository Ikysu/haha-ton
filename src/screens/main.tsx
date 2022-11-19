import React from 'react';
import { Text, View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { NavioScreen } from 'rn-navio';
import MapView, { Region } from 'react-native-maps';

import { services, useServices } from '../services';
import { useStores } from '../stores';

import { useAppearance } from '../utils/hooks';

export const Main: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const { ui } = useStores();
  const { t, api, navio } = useServices();

  const [location, setLocation] = React.useState<Region>();

  const midis = {
    latitude: 55.1984224,
    longitude: 61.3205282,
  };

  React.useEffect(() => {
    const scale = 0.005;
    setLocation({
      ...midis,
      latitudeDelta: scale,
      longitudeDelta: scale,
    });
  }, []);

  return (
    <View flex bg-bgColor>
      <MapView region={location} style={{ width: `100%`, height: '100%' }} />
    </View>
  );
});
Main.options = () => ({
  title: services.t.do('map.title'),
});
