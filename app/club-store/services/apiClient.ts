import axios, { AxiosRequestConfig } from "axios";
import {
  API_ENDPOINT,
  API_ENDPOINT_NEW,
  API_ENDPOINT_SECOND,
  API_PAYMENT_ENDPOINT,
} from "../constants/api.constant";
import { responseInterceptorOnErrorV2 } from "./errorInterceptorV2";
import { responseParser } from "../services/responseParser";

const DEFAULT_TIMEOUT = 30000;

export const nestApiClient = axios.create({
  withCredentials: true,
  baseURL: API_ENDPOINT_NEW,
});

export const authRequestInterceptor = (config: AxiosRequestConfig) => {
  return config;
};

nestApiClient.interceptors.request.use(authRequestInterceptor);
nestApiClient.interceptors.response.use(
  responseParser,
  responseInterceptorOnErrorV2
);

export const expressApiClient = axios.create({
  withCredentials: true,
  baseURL: API_ENDPOINT,
  timeout: DEFAULT_TIMEOUT,
});

expressApiClient.interceptors.request.use(authRequestInterceptor);
expressApiClient.interceptors.response.use(
  responseParser,
  responseInterceptorOnErrorV2
);

export const paymentAPiClient = axios.create({
  withCredentials: true,
  baseURL: API_PAYMENT_ENDPOINT,
  timeout: DEFAULT_TIMEOUT,
});
paymentAPiClient.interceptors.request.use(authRequestInterceptor);
paymentAPiClient.interceptors.response.use(
  responseParser,
  responseInterceptorOnErrorV2
);

export const expressApiClientV2 = axios.create({
  withCredentials: true,
  baseURL: API_ENDPOINT_SECOND,
  timeout: DEFAULT_TIMEOUT,
});
expressApiClientV2.interceptors.request.use(authRequestInterceptor);
expressApiClientV2.interceptors.response.use(
  responseParser,
  responseInterceptorOnErrorV2
);
