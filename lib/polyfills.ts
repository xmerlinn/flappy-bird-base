// Polyfill localStorage for Node.js environment (SSR)
if (typeof window === 'undefined' && typeof globalThis.localStorage === 'undefined') {
  const storage = new Map<string, string>();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
  };
}

export {};
