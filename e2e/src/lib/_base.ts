import Axios, { AxiosError, AxiosInstance } from 'axios';

const baseAxios = (): AxiosInstance => {
  return Axios.create({
    timeout: 1500,
  });
};

export const ApiWithBaseAxios = (): AxiosInstance => {
  const axios = baseAxios();
  /** ここに何か入れる */

  return axios;
};
