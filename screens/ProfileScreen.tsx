import { Image, StyleSheet } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Text, View } from '../components/Themed';
import { ProfileAtom } from '../store/profile.atom';

export default function ProfileScreen() {
  const profile = useRecoilValue(ProfileAtom);

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://web.damirlut.online/pchel.png' }} style={styles.profile} />
      <Text style={styles.name}>{profile.name}</Text>
      <Text>Выполнено заказов: {profile.pkg.delivered}</Text>
      <Text>Отправлено: {profile.pkg.sent}</Text>
      <Text>Зареган с {new Date(profile.reg_date).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    flex: 1,
    alignItems: 'center',
  },
  profile: {
    height: 196,
    width: 196,
    borderRadius: 9999,
  },
  name: {
    fontSize: 24,
    marginBottom: 16,
  },
});
