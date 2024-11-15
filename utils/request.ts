interface RequestResponse<T = any> {
  status: number;
  data: T;
  headers: Headers;
}

export default async function request<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<RequestResponse<T>> {
  const result = await fetch(input, init);
  let data: T | undefined;

  try {
    data = await result.json();
  } catch (err) {
    return Promise.reject(
      new RequestError('Failed to parse JSON', {
        status: result.status,
        headers: result.headers,
        data: undefined,
      })
    );
  }

  const response: RequestResponse<T> = {
    status: result.status,
    data: data as T, // @note: data might be undefined, but for convenience, we use 'as T' here
    headers: result.headers,
  };

  if (!result.ok) {
    return Promise.reject(
      new RequestError(
        `Request failed with status ${result.status}${data && typeof data === 'object' && 'message' in data ? ` - ${(data as any).message}` : ''}`,
        response
      )
    );
  }

  return response;
}

export class RequestError extends Error {
  response: RequestResponse;

  constructor(message: string, response: RequestResponse) {
    super(message);
    this.response = response;
  }
}
