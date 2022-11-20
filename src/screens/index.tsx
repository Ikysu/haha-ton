import { Navio } from 'rn-navio';

import { Main } from './main';
import { Settings } from './settings';
import { Example } from './_screen-sample';

import { useAppearance } from '../utils/hooks';
import { screenDefaultOptions, tabDefaultOptions, getTabBarIcon } from '../utils/designSystem';
import { Profile } from './Profile';
import { Send } from './Send';
import { List } from './List';
import { Button } from 'react-native-ui-lib';
import { ChooseLocation } from './ChooseLocation';

// NAVIO
export const navio = Navio.build({
  screens: {
    Main,
    Profile,
    Settings,
    Example,
    Send,
    List,
    ChooseLocation,
  },
  stacks: {
    MainStack: ['Main', 'Example'],
    ExampleStack: ['Example'],
    SendStack: ['Send', 'ChooseLocation'],
    ProfileStack: ['Profile', 'Settings'],
    SettingsStack: ['Settings'],
    ChooseLocationStack: ['ChooseLocation'],
  },
  tabs: {
    MapTab: {
      stack: 'MainStack',
      options: {
        title: 'Заказы',
        tabBarIcon: getTabBarIcon('MapTab'),
      },
    },
    SendTab: {
      stack: ['Send', 'ChooseLocation'],
      options: () => ({
        title: 'Отправить',
        tabBarIcon: getTabBarIcon('SendTab'),
      }),
    },
    ListTab: {
      stack: ['List'],
      options: () => ({
        title: 'Мои доставки',
        tabBarIcon: getTabBarIcon('ListTab'),
      }),
    },
    ProfileTab: {
      stack: 'ProfileStack',
      options: () => ({
        title: 'Профиль',
        tabBarIcon: getTabBarIcon('ProfileTab'),
      }),
    },
  },
  modals: {
    ExampleModal: 'ExampleStack',
    ChooseLocation: 'ChooseLocationStack',
  },
  root: 'Tabs',
  hooks: [useAppearance],
  options: {
    stack: screenDefaultOptions,
    tab: tabDefaultOptions,
  },
});

export const getNavio = () => navio;
export const AppRoot = navio.Root;
