import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { TextField, View } from 'react-native-ui-lib';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { NavioScreen } from 'rn-navio';

import { services, useServices } from '../services';
// import {useStores} from '../stores';
import { Section } from '../components/section';
import { BButton } from '../components/button';
import { useAppearance } from '../utils/hooks';

export type Props = {
  type?: 'push';
};

export const Send: NavioScreen<Props> = observer(({ type = 'push' }) => {
  useAppearance(); // for Dark Mode
  const navigation = useNavigation();
  const { t, navio } = useServices();
  // const {ui} = useStores();

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
    <View flex bg-bgColor padding-5>
      <ScrollView contentInsetAdjustmentBehavior="always">
        <TextField text70 floatingPlaceholder placeholder="Откуда" floatOnFocus />
        <TextField text70 floatingPlaceholder placeholder="Куда" floatOnFocus />
        <TextField text70 floatingPlaceholder placeholder="Получатель" floatOnFocus />
        <View flex style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextField
            style={{ width: '30%' }}
            text70
            floatingPlaceholder
            placeholder="Вес"
            floatOnFocus
          />
          <TextField
            style={{ width: '30%' }}
            text70
            floatingPlaceholder
            placeholder="Длина"
            floatOnFocus
          />
          <TextField
            style={{ width: '30%' }}
            text70
            floatingPlaceholder
            placeholder="Высота"
            floatOnFocus
          />
        </View>
      </ScrollView>
    </View>
  );
});

Send.options = (props) => ({
  headerBackTitleStyle: false,
  title: services.t.do('send.title'),
});
