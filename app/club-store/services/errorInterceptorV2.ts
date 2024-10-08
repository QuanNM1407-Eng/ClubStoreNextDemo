// import { addDDError } from 'analytics';
import axios, { AxiosError } from "axios";
import bridge from "../bridge";
// import { tracker } from "configs/titan.config";
import { API_ENDPOINT } from "../constants/api.constant";
// import { DEFAULT_HEADERS } from "../constants/defaultHeaders.constant";
// import { getStore } from "store/configureStore";
// import { globalOp } from "store/global";
import { responseParser } from "./responseParser";

const retryAxios = axios.create();
retryAxios.interceptors.response.use(responseParser);

let isRefreshing = false;
// failed(403) requests
let failedQueue = [] as any;
let retry = false;
const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

export const getAxiosErrorDetails = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return {
      code: error.code,
      name: error.name,
      stack: error.stack,
      message: error.message,
      config: {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
        timeout: error.config.timeout,
        headers: error.config.headers,
      },
      response: {
        data: error.response?.data,
        headers: error.response?.headers,
      },
      isCancel: axios.isCancel(error),
    };
  }
  return { error };
};

export class RequestCancelError extends Error {
  error: unknown;
  constructor(error: unknown) {
    super("RequestCancelError");
    this.error = error;
  }
}

export class UnexpectedError extends Error {
  error: unknown;
  constructor(error: unknown) {
    super("UnexpectedError");
    this.error = error;
  }
}

export class UnauthorizedError extends Error {
  error: unknown;
  constructor(error: unknown) {
    super("UnauthorizedError");
    this.error = error;
  }
}

export class APIError extends Error {
  code: number;
  originError: AxiosError<any>;
  constructor(code: number, error: AxiosError<any>) {
    super("APIError");
    this.code = code;
    this.originError = error;
  }
}

const parseError = (error: unknown) => {
  if (axios.isCancel(error)) {
    return new RequestCancelError(error);
  }
  if (!axios.isAxiosError(error)) return new UnexpectedError(error);
  if (error.response?.status === 401 || error.response?.status === 403) {
    return new UnauthorizedError(error);
  }
  if (typeof error.response?.data?.error === "number") {
    return new APIError(error.response?.data?.error, error);
  }
  return new UnexpectedError(error);
};

const getOriginConfig = (rawError: unknown) => {
  if (axios.isAxiosError(rawError)) {
    return rawError.config;
  }

  return null;
};

export const responseInterceptorOnErrorV2 = async (rawError: unknown) => {
  const error = parseError(rawError);
  const originalRequest = getOriginConfig(rawError);
  // addDDError(error, getAxiosErrorDetails(rawError));
  const token = bridge.getRefreshToken();

  if (error instanceof UnauthorizedError && originalRequest != null) {
    if (!retry) {
      if (isRefreshing) {
        // If I'm refreshing the token I send request to a queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return retryAxios(originalRequest);
          })
          .catch((err) => err);
      }

      retry = true;
      isRefreshing = true; // set the refreshing var to true

      if (!token) {
        failedQueue = [];
        getStore().dispatch(globalOp.logoutAsync(false));
        throw error;
      }

      // If none of the above, refresh the token and process the queue
      return new Promise((resolve, reject) => {
        refreshAccessToken() // The method that refreshes my token
          .then(() => {
            processQueue(null); // Resolve queued
            resolve(retryAxios(originalRequest)); // Resolve current

            isRefreshing = false;
            retry = false;
          })
          .catch((err) => {
            failedQueue = [];
            reject(err);
            getStore().dispatch(globalOp.logoutAsync(false));
          });
      });
    }
  }

  throw error;
};

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
});

// export const refreshAccessToken = async () => {
//   try {
//     const token = bridge.getRefreshToken();
//     const { data } = await axiosInstance(`${API_ENDPOINT}/auth/token/refresh`, {
//       headers: DEFAULT_HEADERS,
//       method: "POST",
//       withCredentials: true,
//       data: {
//         token,
//         deviceToken: tracker.getDeviceToken(),
//       },
//     });

//     bridge.saveRefreshToken(data?.data?.refreshToken);

//     if (data.statusCode === 204 || data.statusCode === 200) {
//       return true;
//     }

//     return false;
//   } catch (err) {
//     if (err.response.status === 403) {
//       getStore().dispatch(
//         globalOp.setNotificationsFromAnyWhere({
//           message: "your.session.has.expired",
//           type: "error",
//         })
//       );
//     }

//     getStore().dispatch(globalOp.logoutAsync(true));
//   }
// };
