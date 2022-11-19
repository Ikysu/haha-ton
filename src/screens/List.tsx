import React, { useEffect } from 'react';
import { ScrollView, FlatList } from 'react-native';
import { ListItem, Text, View } from 'react-native-ui-lib';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { NavioScreen } from 'rn-navio';

import { services, useServices } from '../services';
// import {useStores} from '../stores';
import { Section } from '../components/section';
import { BButton } from '../components/button';
import { useAppearance } from '../utils/hooks';
import { useStores } from '../stores';

export type Props = {
  type?: 'push';
};

export const List: NavioScreen<Props> = observer(({ type = 'push' }) => {
  useAppearance(); // for Dark Mode
  const navigation = useNavigation();
  const { t, navio, api } = useServices();
  const { ui, user } = useStores();

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
    api.package.list();
  }, []);

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({});
  };

  // UI Methods

  return (
    <View flex bg-bgColor>
      <FlatList
        data={user.stores}
        renderItem={({ item, index }) => (
          <ListItem key={item.uid}>
            <Text>{item.uid}</Text>
            <ListItem.Part right>
              <Text>{item.status.type}</Text>
            </ListItem.Part>
          </ListItem>
        )}
        keyExtractor={(item) => item.uid}
      />
    </View>
  );
});

List.options = (props) => ({
  headerBackTitleStyle: false,
  title: services.t.do('list.title'),
});
