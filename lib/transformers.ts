export function transformPrismaDatesToString<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map(transformPrismaDatesToString) as unknown as T;
  }
  if (typeof data === 'object') {
    const transformed: any = {};
    for (const [key, value] of Object.entries(data)) {
      transformed[key] = transformPrismaDatesToString(value);
    }
    return transformed;
  }
  return data;
}
