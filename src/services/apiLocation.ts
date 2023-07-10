import { BASE_LOCATION_URL } from "Consts/url";
import axios, { AxiosError, AxiosResponse } from "axios";

/**
 * Axios instance config
 */
const api = axios.create({
  baseURL: BASE_LOCATION_URL,
  timeout: 10 * 1000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor
 */
const onResponseSuccess = (response: AxiosResponse): AxiosResponse =>
  response.data;
const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error.response ? error.response.data : error);
};

/**
 * Middleware
 */
api.interceptors.response.use(onResponseSuccess, onResponseError);

export default api;
