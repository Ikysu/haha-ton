import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Button, Checkbox, Colors, Text, TextField, View } from 'react-native-ui-lib';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { NavioScreen } from 'rn-navio';

import { services, useServices } from '../services';
// import {useStores} from '../stores';

import { useAppearance } from '../utils/hooks';
import { CreatePackageBody } from '../services/api/type';
import { Icon } from '../components/icon';
import { useStores } from '../stores';

export type Props = {
  type?: 'push';
};

export const Send: NavioScreen<Props> = observer(({ type = 'push' }) => {
  useAppearance(); // for Dark Mode
  const navigation = useNavigation();
  const { t, navio, api } = useServices();

  const { send } = useStores();

  // Start
  useEffect(() => {
    configureUI();
  }, []);

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({});
  };

  const createPackage = () => {
    api.package.create(send.data).then(console.log).catch(console.warn);
    send.set('data', { ...send.defaultData });
  };

  // UI Methods

  const Search = (props: { placeholder: string; type: 'start' | 'end' }) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TextField
        style={{ width: '85%' }}
        text70
        floatingPlaceholder
        color={Colors.$textDefault}
        placeholder={props.placeholder}
        value={send.data[props.type].name}
        editable={false}
      />
      <Icon
        name={'search'}
        onPress={() => {
          navio.show('ChooseLocation');
          send.current = props.type;
        }}
      />
    </View>
  );

  return (
    <View flex bg-bgColor padding-5>
      <ScrollView contentInsetAdjustmentBehavior="always">
        <Search placeholder="Откуда" type="start" />
        <Search placeholder="Куда" type="end" />
        <Input
          placeholder="Получатель"
          value={send.data.recipient_uid}
          onChangeText={(text: string) => send.setData('recipient_uid', text)}
        />
        <Input
          placeholder="Вес"
          value={send.data.info.weight}
          onChangeText={(text: string) => send.setInfo('weight', +text)}
        />
        <View flex style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Input
            style={{ width: '30%' }}
            placeholder="Ширина"
            value={send.data.info.width}
            onChangeText={(text: string) => send.setInfo('width', +text)}
          />
          <Input
            style={{ width: '30%' }}
            placeholder="Длина"
            value={send.data.info.length}
            onChangeText={(text: string) => send.setInfo('length', +text)}
          />
          <Input
            style={{ width: '30%' }}
            placeholder="Высота"
            value={send.data.info.height}
            onChangeText={(text: string) => send.setInfo('height', +text)}
          />
        </View>
        <View flex style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Checkbox
            color={Colors.primary}
            label={'В пакете'}
            value={send.data.info.sachet}
            onValueChange={(text: string) => send.setInfo('sachet', +text)}
          />
          <Checkbox
            color={Colors.primary}
            label={'Хрупкое'}
            value={send.data.info.fragile}
            onValueChange={(text: string) => send.setInfo('fragile', +text)}
          />
        </View>
        <Button bg-primary enableShadow marginT-36 onPress={createPackage}>
          <Text>Отправить!</Text>
        </Button>
      </ScrollView>
    </View>
  );
});

Send.options = (props) => ({
  headerBackTitleStyle: false,
  title: services.t.do('send.title'),
});

const Input = (props: {
  value: any;
  placeholder: string;
  onChangeText: (text: string) => void;
  style?: any;
}) => <TextField text70 floatingPlaceholder color={Colors.$textDefault} {...props} />;
