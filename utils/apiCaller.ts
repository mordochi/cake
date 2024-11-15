import { baseApiUrl, selfApiUrl } from '@/constants';
import request from './request';

const createApiCaller = (baseUrl: string) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: <TData = any>(
    url: Parameters<typeof request>[0],
    options?: Parameters<typeof request>[1]
  ) => request<TData>(`${baseUrl}${url}`, options),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async <TData = any>(
    url: Parameters<typeof request>[0],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    options: Parameters<typeof request>[1] = {}
  ) => {
    const { headers = {}, ...restOptions } = options;

    return await request<TData>(`${baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...restOptions,
      body: JSON.stringify(body),
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: async <TData = any>(
    url: Parameters<typeof request>[0],
    options: Parameters<typeof request>[1] = {}
  ) => {
    const { headers = {}, ...restOptions } = options;

    return await request<TData>(`${baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...restOptions,
    });
  },
});

/**
 * API caller used for calling internal route handlers
 * @type {ReturnType<typeof createApiCaller>}
 */
export const selfApiCaller = createApiCaller(selfApiUrl);

/**
 * API caller used for calling BE API endpoints
 * @type {ReturnType<typeof createApiCaller>}
 */
export const baseApiCaller = createApiCaller(baseApiUrl);

/**
 * API caller used for calling generic API endpoints
 * @type {ReturnType<typeof createApiCaller>}
 */
export const apiCaller = createApiCaller('');
