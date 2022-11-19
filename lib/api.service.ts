import axios, { AxiosRequestConfig } from 'axios';
import { setRecoil } from 'recoil-nexus';
import { ProfileAtom } from '../store/profile.atom';
import { ServerResponse, UserProfile } from './types';

export class UserService {
  static async get(uid: string) {
    const data = await API.request<UserProfile>('users/get', {
      params: { uid },
      method: 'GET',
    });
    return data;
  }

  static async updateGeo(latitude: number, longitude: number) {
    const data = await API.request<UserProfile>('users/updateGeo', {
      data: { latitude, longitude },
    });
    return data;
  }
}

export class API {
  private static readonly baseurl = 'https://hahaton.iky.su/';
  private static token: string;

  static async login(token: string, name: string) {
    this.token = token;
    const data = await this.request<UserProfile>('users/login', {
      params: { token, name },
      method: 'GET',
    });
    if (data.ok) {
      setRecoil(ProfileAtom, data.data);
    }
  }

  static async request<T>(uri: string, params: AxiosRequestConfig) {
    const { data } = await axios<ServerResponse<T>>({
      url: this.baseurl + uri,
      headers: {
        authorization: this.token,
      },
      method: 'POST',
      ...params,
    });
    return data;
  }
}
