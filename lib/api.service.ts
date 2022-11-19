import axios, { AxiosRequestConfig } from 'axios';
import { setRecoil } from 'recoil-nexus';
import { ProfileAtom } from '../store/profile.atom';
import { CreatePackageBody, PackageObject, ServerResponse, UserProfile } from './types';

export class UserService {
  static get(uid: string) {
    return API.request<UserProfile>('users/get', {
      params: { uid },
      method: 'GET',
    });
  }

  static updateGeo(latitude: number, longitude: number) {
    return API.request<UserProfile>('users/updateGeo', {
      data: { latitude, longitude },
    });
  }
}

export class PackageService {
  static get(package_uid: string) {
    return API.request<PackageObject>('packages/get', {
      params: { uid: package_uid },
    });
  }

  static create(params: CreatePackageBody) {
    return API.request<PackageObject>('packages/create', {
      params,
    });
  }

  static map() {
    return API.request<PackageObject[]>('packages/map', {});
  }

  static list() {
    return API.request<PackageObject[]>('packages/list', {});
  }

  static take(package_uid: string) {
    return API.request<PackageObject>('packages/take', {
      data: { uid: package_uid },
    });
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
