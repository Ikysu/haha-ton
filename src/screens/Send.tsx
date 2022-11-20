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
  const [info, setInfo] = React.useState(send.data);

  // Start
  useEffect(() => {
    configureUI();
  }, []);

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({});
  };

  const createPackage = () => {
    send.set('data', info);
    api.package.create(info);
    send.set('data', { ...send.defaultData });
  };

  const update = (key: string, value: any) => setInfo((prev) => ({ ...prev, [key]: value }));
  const updateInfo = (key: string, value: any) => update('info', { ...info.info, [key]: value });

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
        value={info[props.type].name}
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
          value={info.recipient_uid}
          onChangeText={(text: string) => update('recipient_uid', text)}
        />
        <Input
          placeholder="Вес"
          value={info.info.weight}
          onChangeText={(text: string) => updateInfo('weight', +text)}
        />
        <View flex style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Input
            style={{ width: '30%' }}
            placeholder="Ширина"
            value={info.info.width}
            onChangeText={(text: string) => updateInfo('width', +text)}
          />
          <Input
            style={{ width: '30%' }}
            placeholder="Длина"
            value={info.info.length}
            onChangeText={(text: string) => updateInfo('length', +text)}
          />
          <Input
            style={{ width: '30%' }}
            placeholder="Высота"
            value={info.info.height}
            onChangeText={(text: string) => updateInfo('height', +text)}
          />
        </View>
        <View flex style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Checkbox
            color={Colors.primary}
            label={'В пакете'}
            value={info.info.sachet}
            onValueChange={(text: string) => updateInfo('sachet', +text)}
          />
          <Checkbox
            color={Colors.primary}
            label={'Хрупкое'}
            value={info.info.fragile}
            onValueChange={(text: string) => updateInfo('fragile', +text)}
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
