import { atom } from 'recoil';

export const GeoAtom = atom({
  key: 'get.atom',
  default: {
    latitude: 0,
    longitude: 0,
  },
});
