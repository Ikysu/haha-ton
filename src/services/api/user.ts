import { stores } from '../../stores';
import { ServerResponse, UserProfile } from './type';

export class UserApi {
  constructor(private baseUrl: string) {}
  login = async (token: string, name: string) => {
    stores.user.set('token', token);
    const resp = await fetch(this.baseUrl + `users/login?token=${token}&name=${name}`, {
      method: 'GET',
    });
    const json: ServerResponse<UserProfile> = await resp.json();

    if (json.ok) {
      stores.user.set('profile', json.data);
    }
  };
}
