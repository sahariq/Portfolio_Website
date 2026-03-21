/**
 * File System Cache - TTL-based caching layer
 * Provides generic caching with automatic expiration based on TTL
 * Optimized: Supports prefix-based invalidation for efficient cache management
 */

import { CacheEntry, DEFAULT_CACHE_TTL } from './file-system-types'

/**
 * Generic cache implementation with TTL-based expiration
 * Stores values with automatic expiration after a specified time-to-live
 * Optimized: Supports prefix-based invalidation for efficient cache management
 */
export class FileSystemCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  /**
   * Set a value in the cache with optional TTL
   * @param key - The cache key
   * @param value - The value to cache
   * @param ttl - Time-to-live in milliseconds (defaults to DEFAULT_CACHE_TTL)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl ?? DEFAULT_CACHE_TTL,
    }
    this.cache.set(key, entry)
  }

  /**
   * Get a value from the cache
   * Returns null if the key doesn't exist or the entry has expired
   * @param key - The cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Check if a key exists in the cache and hasn't expired
   * @param key - The cache key
   * @returns true if the key exists and hasn't expired, false otherwise
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)

    if (!entry) {
      return false
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Invalidate a specific cache entry
   * @param key - The cache key to invalidate
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Invalidate all cache entries with a specific prefix
   * Optimized: Efficient prefix-based invalidation
   * @param prefix - The cache key prefix to invalidate
   */
  invalidateByPrefix(prefix: string): void {
    const keysToDelete: string[] = []
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key)
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Check if a cache entry has expired
   * @param entry - The cache entry to check
   * @returns true if the entry has expired, false otherwise
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    const now = Date.now()
    const expirationTime = entry.timestamp + entry.ttl
    return now > expirationTime
  }
}
