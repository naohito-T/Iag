import { AxiosInstance } from 'axios';

export abstract class RequestAPI {
  protected axios: AxiosInstance;

  public constructor(axios: AxiosInstance) {
    this.axios = axios;
  }
}
