import { IRequestServiceAPI } from '@/lib/service';
import { RequestAPI } from '@/lib/request/api';
import { AxiosError } from 'axios';
import { Config } from '@/config';

const config = new Config();

export class RequestService extends RequestAPI implements IRequestServiceAPI {
  /** jestのtest前にtxtを作成(beforeAll)終わった後、afterAll */
  public postLine = async (texts: string[]): Promise<void> => {
    const payload: URLSearchParams = new URLSearchParams({
      message: texts.join('<br/>').slice(0, 999), // 最大1000文字とのこと
    });

    await this.axios
      .post(config.lineURL, payload, {
        headers: {
          Authorization: `Bearer ${config.lineToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch((e: AxiosError) => {
        console.log(e.toJSON());
      });
  };
}
