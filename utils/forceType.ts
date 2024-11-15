export function forceType<T>(value: unknown): T {
  return value as T;
}
