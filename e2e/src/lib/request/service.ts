import { IRequestServiceAPI } from '@/lib/service';
import { RequestAPI } from '@/lib/request/api';
import { AxiosError } from 'axios';
import { Config } from '@/config';

const config = new Config();
export class RequestService extends RequestAPI implements IRequestServiceAPI {
  /** jestのtest前にtxtを作成(beforeAll)終わった後、afterAll */
  public postTeams = async (texts: string[]): Promise<void> => {
    const payload = texts.join('<br/>').slice(0, 600);
    await this.axios
      .post(config.teamsURL, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        text: JSON.stringify(payload),
      })
      .catch((e: AxiosError) => {
        console.log(e.toJSON());
      });
  };
}
