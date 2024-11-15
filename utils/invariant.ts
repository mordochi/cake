function invariant(condition: unknown, format: string): void {
  if (!condition) {
    throw new Error(format);
  }
}
export default invariant;
