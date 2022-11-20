import { makeAutoObservable } from 'mobx';
import { hydrateStore, makePersistable } from 'mobx-persist-store';
import { CreatePackageBody } from '../services/api/type';

export class SendStore implements IStore {
  defaultData = {
    recipient_uid: '',
    info: {
      sachet: false,
      fragile: false,
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
    },
    rating: 0,
    start: {
      latitude: 0,
      longitude: 0,
      name: '',
    },
    end: {
      latitude: 0,
      longitude: 0,
      name: '',
    },
  };

  data = { ...this.defaultData };

  current!: 'start' | 'end';

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: SendStore.name,
      properties: ['data', 'current'],
    });
  }

  // Unified set methods
  set<T extends StoreKeysOf<SendStore>>(what: T, value: SendStore[T]) {
    (this as SendStore)[what] = value;
  }
  setMany<T extends StoreKeysOf<SendStore>>(obj: Record<T, SendStore[T]>) {
    for (const [k, v] of Object.entries(obj)) {
      this.set(k as T, v as SendStore[T]);
    }
  }

  setData(key: keyof typeof this.data, value: any) {
    this.set('data', { ...this.data, [key]: value });
  }

  // Hydration
  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
