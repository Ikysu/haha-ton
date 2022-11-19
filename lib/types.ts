export type ServerResponse<T> = {
  ok: boolean;
  data: T;
};

export type UserProfile = {
  uid: string;
  name: string;
  rating: number;
  reg_date: string;
  pkg: {
    sent: number;
    delivered: number;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
};