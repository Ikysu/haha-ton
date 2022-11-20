import React, { useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { ListItem, View, Text } from 'react-native-ui-lib';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { NavioScreen } from 'rn-navio';

import { services, useServices } from '../services';
// import {useStores} from '../stores';
import { Section } from '../components/section';
import { BButton } from '../components/button';
import { useAppearance } from '../utils/hooks';
import { useStores } from '../stores';

import Locations from '../services/locations';

export type Props = {
  type?: 'start' | 'end';
};

export const ChooseLocation: NavioScreen<Props> = observer(({ type }) => {
  useAppearance(); // for Dark Mode
  const navigation = useNavigation();
  const { t, navio } = useServices();
  const { send } = useStores();

  // State

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
    <View flex bg-bgColor padding-10>
      <FlatList
        data={Locations}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => {
              send.setData(send.current, item);
              goBack();
            }}>
            <Text>{item.name}</Text>
          </ListItem>
        )}
      />
    </View>
  );
});

ChooseLocation.options = (props) => ({
  headerBackTitleStyle: false,
  title: `Остановка`,
});
