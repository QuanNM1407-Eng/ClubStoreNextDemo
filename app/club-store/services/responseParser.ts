import { AxiosResponse } from 'axios';

export const responseParser = (response: AxiosResponse<any>) => {
  const { data, status, statusText } = response;
  return { data, status, statusText };
};
