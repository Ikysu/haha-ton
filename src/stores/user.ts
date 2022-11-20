import { makeAutoObservable } from 'mobx';
import { hydrateStore, makePersistable } from 'mobx-persist-store';
import { PackageObject, UserProfile } from '../services/api/type';

export class UserStore implements IStore {
  token = '';
  profile!: UserProfile;
  stores: PackageObject[] = [];
  activeStores: PackageObject[] = [];

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: UserStore.name,
      properties: ['token', 'profile', 'stores', 'activeStores'],
    });
  }

  // Unified set methods
  set<T extends StoreKeysOf<UserStore>>(what: T, value: UserStore[T]) {
    (this as UserStore)[what] = value;
  }
  setMany<T extends StoreKeysOf<UserStore>>(obj: Record<T, UserStore[T]>) {
    for (const [k, v] of Object.entries(obj)) {
      this.set(k as T, v as UserStore[T]);
    }
  }

  // Hydration
  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
