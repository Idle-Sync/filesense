export type Timed<T> = { label: string; milliseconds: number; value: T };

export async function timed<T>(label: string, fn: () => T | Promise<T>): Promise<Timed<T>> {
  const start = performance.now();
  const value = await fn();
  return { label, milliseconds: performance.now() - start, value };
}
