import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useRecoilValue } from 'recoil';
import { Text, View } from '../components/Themed';
import { GeoAtom } from '../store/geo.atom';
import { RootTabScreenProps } from '../types';
import Locations from '../lib/coords';
import SETTINGS from '../lib/settings';

export default function MapScreen({ navigation }: RootTabScreenProps<'Map'>) {
  const geoLocation = useRecoilValue(GeoAtom);
  const [location, setLocation] = React.useState<Region>();

  React.useEffect(() => {
    const scale = 0.005;
    setLocation({
      ...geoLocation,
      latitudeDelta: scale,
      longitudeDelta: scale,
    });
  }, []);

  const midis = {
    longitude: 55.1984224,
    latitude: 61.3205282,
  };

  return (
    <View style={styles.container}>
      <MapView region={location} style={styles.map}>
        {Locations.map((coords) => (
          <Marker
            key={JSON.stringify(coords)}
            coordinate={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
            title={coords.name}
          />
        ))}
      </MapView>
    </View>
  );
}

/*
<MapViewDirections
          origin={destination}
          destination={destination}
          apikey={SETTINGS.GOOGLE_API}
        />
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
