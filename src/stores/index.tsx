import React from 'react';

import './_hydration';
import { UIStore } from './ui';
import { UserStore } from './user';
import { SendStore } from './send';

class Stores {
  ui = new UIStore();
  user = new UserStore();
  send = new SendStore();
}
export const stores = new Stores();

const storeContext = React.createContext<Stores>(stores);
export const StoresProvider = ({ children }: any) => (
  <storeContext.Provider value={stores}>{children}</storeContext.Provider>
);
export const useStores = (): Stores => React.useContext(storeContext);

export const hydrateStores = async (): PVoid => {
  for (const key in stores) {
    if (Object.prototype.hasOwnProperty.call(stores, key)) {
      const s = (stores as any)[key] as IStore;

      if (s.hydrate) {
        await s.hydrate();
      }
    }
  }
};
