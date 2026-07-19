// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\recommendationCache.js

/**
 * Recommendation Cache
 * Standard in-memory cache to prevent redundant executions and reduce latency.
 */
class RecommendationCache {
  constructor() {
    this.cache = new Map();
    this.telemetry = {
      hits: 0,
      misses: 0,
      invalidations: 0
    };
  }

  /**
   * Generates a unique key based on inputs.
   */
  generateKey(userId, extraParams = {}) {
    if (!userId) return 'anonymous';
    // Stringify simple key features to invalidate when they change
    const featureString = Object.entries(extraParams)
      .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
      .sort()
      .join('|');
    return `${userId}#${featureString}`;
  }

  /**
   * Retrieves data from the cache if it exists and is fresh.
   */
  get(key) {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      const now = Date.now();
      
      // Cache entries expire after 5 minutes (300,000 ms)
      if (now - entry.timestamp < 300000) {
        this.telemetry.hits++;
        return entry.data;
      }
      
      // Evict expired entry
      this.cache.delete(key);
    }
    
    this.telemetry.misses++;
    return null;
  }

  /**
   * Stores data in the cache.
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Explicitly clears a specific cache key or the entire cache.
   */
  invalidate(key = null) {
    this.telemetry.invalidations++;
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Returns cache performance stats.
   */
  getStats() {
    return {
      size: this.cache.size,
      ...this.telemetry
    };
  }
}

export const recommendationCache = new RecommendationCache();
