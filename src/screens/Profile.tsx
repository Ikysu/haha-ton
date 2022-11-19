import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Button, Text, View } from 'react-native-ui-lib';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { NavioScreen } from 'rn-navio';

import { services, useServices } from '../services';
// import {useStores} from '../stores';
import { Section } from '../components/section';
import { BButton } from '../components/button';
import { useAppearance } from '../utils/hooks';
import { useStores } from '../stores';
import { getTabBarIcon } from '../utils/designSystem';
import { Icon } from '../components/icon';

export type Props = {
  type?: 'push';
};

export const Profile: NavioScreen<Props> = observer(({ type = 'push' }) => {
  useAppearance(); // for Dark Mode
  const navigation = useNavigation();
  const { t, navio } = useServices();
  const { user } = useStores();

  // State

  // Methods
  const push = () => navio.push('Example', { type: 'push' });
  const pushStack = () => navio.pushStack('ExampleStack');
  const jumpTo = () => navio.jumpTo('MapTab');
  const show = () => navio.show('ExampleModal');
  const setRoot = () => navio.setRoot('Tabs');
  const goBack = () => navio.pop();

  // Start
  useEffect(() => {
    configureUI();
  }, []);

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({});
  };

  // UI Methods

  return (
    <View flex bg-bgColor centerH paddingT-32>
      <Avatar source={{ uri: user.profile.avatar }} size={144} animate />
      <Text marginB-32 h2>
        {user.profile.name}
      </Text>
      <Text>Выполнено заказов: {user.profile.pkg.delivered}</Text>
      <Text>Отправлено: {user.profile.pkg.sent}</Text>
      <Text>Зареган с {new Date(user.profile.reg_date).toLocaleDateString()}</Text>
    </View>
  );
});

Profile.options = (props) => ({
  headerBackTitleStyle: false,
  title: services.t.do('profile.title'),
  headerRight: () => {
    const { navio } = useServices();
    return <Icon name={'settings-outline'} onPress={() => navio.push('Settings')} />;
  },
});
