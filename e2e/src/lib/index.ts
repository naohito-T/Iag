import { ApiWithBaseAxios } from '@/lib/_base';
import { IRequestServiceAPI } from '@/lib/service';
import { RequestService } from '@/lib/request';

export interface API {
  service: IRequestServiceAPI;
}

const service = new RequestService(ApiWithBaseAxios());

export const api: API = {
  service,
};
