import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as Location from 'expo-location';

export default function MapScreen({ navigation }: RootTabScreenProps<'Map'>) {
  const [location, setLocation] = React.useState<Region>();

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const scale = 0.005;
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: scale,
        longitudeDelta: scale,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView region={location} style={styles.map}>
        <Marker
          coordinate={{ latitude: location?.latitude || 0, longitude: location?.longitude || 0 }}
          title={'Откуда'}
          description={'Вы здесь'}
          image={require('../assets/images/image1.png')}
        />
      </MapView>
    </View>
  );
}

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
