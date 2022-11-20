import React from 'react';
import { Text, View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { NavioScreen } from 'rn-navio';
import MapView, { Marker, Region } from 'react-native-maps';

import { services, useServices } from '../services';
import { useStores } from '../stores';

import { useAppearance } from '../utils/hooks';

const scale = 0.005;

export const Main: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const { ui } = useStores();
  const { t, api, navio } = useServices();

  const [location, setLocation] = React.useState<Region>();
  const [Locations, setLocations] = React.useState<Array<typeof midis>>([]);

  const midis = {
    latitude: 55.65584467,
    longitude: 37.38352065,
  };

  React.useEffect(() => {
    setLocation({
      ...midis,
      latitudeDelta: scale,
      longitudeDelta: scale,
    });
    api.package.map().then((data) => {
      if (data) {
        setLocations(data.map((store) => store.start));
        console.log(data);
      }
    });
  }, []);

  return (
    <View flex bg-bgColor>
      <MapView region={location} style={{ width: `100%`, height: '100%' }}>
        {Locations.map((coords) => (
          <Marker
            key={JSON.stringify(coords)}
            coordinate={{
              latitude: +coords.latitude,
              longitude: +coords.longitude,
            }}
          />
        ))}
      </MapView>
    </View>
  );
});
Main.options = () => ({
  title: services.t.do('map.title'),
});
