import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Text, View, SegmentedControl, Colors} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';

import {Section} from '../components/section';
import {Row} from '../components/row';
import {
  appearances,
  appearancesUI,
  appearanceUIToInternal,
  languages,
  languagesUI,
  languageUIToInternal,
} from '../utils/types/enums';
import {useAppearance} from '../utils/hooks';
import {useStores} from '../stores';
import {HeaderButton} from '../components/button';
import {services} from '../services';

export const Settings: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const {ui} = useStores();

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="always">
        <Section title={'UI'}>
          <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  Appearance
                </Text>
              </View>


            </Row>
          </View>

          <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  Language
                </Text>
              </View>

      
            </Row>
          </View>
        </Section>
      </ScrollView>
    </View>
  );
});
Settings.options = () => ({
  title: services.t.do('settings.title'),
});
