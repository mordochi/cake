import request, { RequestError } from './request';

const tryExecute = async <T, R = T, K = Error>(
  methodCall: () => Promise<T>,
  successHandler?: (result: T) => R,
  errorHandler?: (error: Error) => K
): Promise<[R | null, K | null]> => {
  try {
    const result = await methodCall();
    const handleResult = successHandler?.(result);
    return [handleResult || (result as R), null];
  } catch (error) {
    const handledError = errorHandler?.(error as Error);
    return [null, handledError || (error as K)];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tryExecuteRequest = <T = any>(
  methodCall: () => ReturnType<typeof request<T>>
) =>
  tryExecute(
    methodCall,
    (result) => result.data,
    (err) => {
      if (err instanceof RequestError) {
        return { ...err.response, message: err.message };
      }

      return {
        status: 500,
        data: undefined,
        message: err.message || 'RequestError: Unknown error',
      };
    }
  );

export { tryExecuteRequest };
