const CACHE_PREFIX = 'geta-cache:';

type CacheEntry<T> = {
  value: T;
  updatedAt: number;
};

function getStorageKey(key: string) {
  return `${CACHE_PREFIX}${key}`;
}

export function readCachedValue<T>(key: string): T | null {
  try {
    const rawValue = localStorage.getItem(getStorageKey(key));

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as CacheEntry<T>;
    return parsed.value ?? null;
  } catch {
    localStorage.removeItem(getStorageKey(key));
    return null;
  }
}

export function writeCachedValue<T>(key: string, value: T): void {
  const payload: CacheEntry<T> = {
    value,
    updatedAt: Date.now(),
  };

  localStorage.setItem(getStorageKey(key), JSON.stringify(payload));
}

export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { force?: boolean } = {},
): Promise<T> {
  if (!options.force) {
    const cachedValue = readCachedValue<T>(key);

    if (cachedValue !== null) {
      return cachedValue;
    }
  }

  const freshValue = await fetcher();
  writeCachedValue(key, freshValue);
  return freshValue;
}

export function invalidateCache(key: string): void {
  localStorage.removeItem(getStorageKey(key));
}

export function invalidateCacheByPrefix(prefix: string): void {
  const keysToRemove: string[] = [];
  const storagePrefix = getStorageKey(prefix);

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (key?.startsWith(storagePrefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function clearAppCache(): void {
  invalidateCacheByPrefix('');
}
