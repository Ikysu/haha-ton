import { PackageApi } from './package';
import { UserApi } from './user';

export class ApiService implements IService {
  private readonly baseurl = 'https://hahaton.iky.su/';
  private inited = false;

  user: UserApi;
  package: PackageApi;

  constructor() {
    this.user = new UserApi(this.baseurl, this);
    this.package = new PackageApi(this.baseurl, this);
  }

  init = async (): PVoid => {
    if (!this.inited) {
      // your code ...

      this.inited = true;
    }
  };
}
