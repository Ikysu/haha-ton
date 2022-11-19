import { atom } from 'recoil';
import { UserProfile } from '../lib/types';

export const ProfileAtom = atom<UserProfile>({
  key: 'profile.atom',
});
