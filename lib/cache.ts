// A simple in-memory cache for prefetching
type CacheEntry<T> = { ts: number; data: T }

class SimpleCache<T> {
  private store = new Map<string, CacheEntry<T>>()

  get(key: string) {
    return this.store.get(key)
  }

  set(key: string, value: CacheEntry<T>) {
    this.store.set(key, value)
  }

  clear() {
    this.store.clear()
  }
}

// Export a single shared cache instance
export const cache = new SimpleCache<any>()
