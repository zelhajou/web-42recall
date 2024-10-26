import { type ClassValue, clsx } from "clsx"
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function convertPrismaDatesToStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (obj instanceof Date) {
    return obj.toISOString() as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertPrismaDatesToStrings) as unknown as T;
  }
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertPrismaDatesToStrings(value);
    }
    return converted;
  }
  return obj;
}
export function createSearchParams(
  currentParams: URLSearchParams | ReadonlyURLSearchParams,
  updates: Record<string, string | null>
): URLSearchParams {
  const params = new URLSearchParams();
  if (currentParams) {
    currentParams.forEach((value, key) => {
      params.set(key, value);
    });
  }
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  return params;
}
