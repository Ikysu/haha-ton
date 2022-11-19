import { ApiService } from '.';
import { stores } from '../../stores';
import { ServerResponse, UserProfile } from './type';

export class UserApi {
  constructor(private baseUrl: string, private api: ApiService) {}
  login = async (token: string, name: string) => {
    stores.user.set('token', token);
    const resp = await fetch(this.baseUrl + `users/login?token=${token}&name=${name}`, {
      method: 'GET',
    });
    const json: ServerResponse<UserProfile> = await resp.json();

    if (json.ok) {
      stores.user.set('profile', json.data);
      this.api.package.list();
    }
  };

  get = async (uid: string) => {
    const resp = await fetch(this.baseUrl + `users/get?uid=${uid}`, {
      method: 'GET',
    });
    const json: ServerResponse<UserProfile> = await resp.json();

    if (json.ok) {
      return json.data;
    }
  };
}
