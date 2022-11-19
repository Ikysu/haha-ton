export type ServerResponse<T> = {
  ok: boolean;
  data: T;
};

export type UserProfile = {
  uid: string;
  name: string;
  rating: number;
  reg_date: string;
  avatar: string;
  verified: boolean;
  pkg: {
    sent: number;
    delivered: number;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
};

export type CreatePackageBody = {
  recipient_uid: string;
  info: {
    sachet: boolean;
    fragile: boolean;
    width: number;
    height: number;
    length: number;
    weight: number;
  };
  rating: number;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
};

export type PackageObject = {
  uid: string;
  sender_uid: string;
  recipient_uid: string;
  info: PackageInfo;
  status: PackageStatus;
  rating: number;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
};

export type PackageInfo = {
  sachet: boolean; // Посылка в покете или без
  fragile: boolean; // Хрупкая посылка
  width: number; // Ширина посылки
  height: number; // Высота посылки
  length: number; // Длинна посылки
  weight: number; // Вес
};

export type PackageStatus = {
  type: 'idle' | 'active' | 'delivered' | 'canceled';
  courier_uid: null | string;
};
