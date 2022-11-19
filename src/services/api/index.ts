import { UserApi } from './user';

export class ApiService implements IService {
  private readonly baseurl = 'https://hahaton.iky.su/';
  private inited = false;

  user: UserApi;

  constructor() {
    this.user = new UserApi(this.baseurl);
  }

  init = async (): PVoid => {
    if (!this.inited) {
      // your code ...

      this.inited = true;
    }
  };
}
