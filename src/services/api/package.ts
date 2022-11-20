import { ApiService } from '.';
import { stores } from '../../stores';
import { CreatePackageBody, PackageObject, ServerResponse } from './type';

export class PackageApi {
  constructor(private baseUrl: string, private api: ApiService) {}

  get = async (uid: string) => {
    const resp = await fetch(this.baseUrl + `packages/get?uid=${uid}`, {
      headers: this.headers,
      method: 'POST',
    });
    const json: ServerResponse<PackageObject> = await resp.json();

    if (json.ok) {
      return json.data;
    }
  };

  list = async () => {
    const resp = await fetch(this.baseUrl + `packages/list`, {
      headers: this.headers,
      method: 'POST',
    });
    const json: ServerResponse<PackageObject[]> = await resp.json();
    console.log(json);
    if (json.ok) {
      stores.user.set('stores', json.data);
    }
  };

  map = async () => {
    const resp = await fetch(this.baseUrl + `packages/map`, {
      headers: this.headers,
      method: 'POST',
    });
    const json: ServerResponse<PackageObject[]> = await resp.json();

    if (json.ok) {
      console.log(json);
      return json.data;
    }
  };

  create = async (body: CreatePackageBody) => {
    const resp = await fetch(this.baseUrl + `packages/create`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.headers,
    });
    const json: ServerResponse<PackageObject> = await resp.json();

    console.log(json);

    if (json.ok) {
      return json.data;
    }
  };

  private get headers() {
    return {
      authorization: stores.user.token,
      'Content-Type': 'application/json',
    };
  }
}
