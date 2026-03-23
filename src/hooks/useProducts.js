import { useState, useEffect, useRef } from 'react'
import { fetchProducts } from '../api/client'

/**
 * Simple in-memory product cache.
 * - Keyed by serialised query params
 * - Entries expire after CACHE_TTL ms (5 min)
 * - forceRefresh busts the specific entry
 * - Shows stale data while revalidating (no flicker on back-nav)
 */
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000

function getCacheEntry(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry
}

function setCacheEntry(key, products) {
  cache.set(key, { products, timestamp: Date.now() })
}

/** Call after create/edit/delete to invalidate stale data */
export function bustProductCache(keyPattern) {
  if (!keyPattern) { cache.clear(); return }
  for (const k of cache.keys()) {
    if (k.includes(keyPattern)) cache.delete(k)
  }
}

export function useProducts(params = {}, { forceRefresh = false } = {}) {
  const cacheKey = JSON.stringify(params)

  // Seed from cache immediately — instant render on back-navigation
  const [products, setProducts] = useState(() => {
    if (forceRefresh) return []
    return getCacheEntry(cacheKey)?.products ?? []
  })
  const [loading, setLoading] = useState(() => {
    if (forceRefresh) return true
    return !getCacheEntry(cacheKey)
  })
  const [error, setError] = useState(null)

  const seededKey = useRef(
    !forceRefresh && getCacheEntry(cacheKey) ? cacheKey : null
  )

  useEffect(() => {
    // Already have a fresh cache hit for this key → skip fetch entirely
    if (!forceRefresh && seededKey.current === cacheKey && getCacheEntry(cacheKey)) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    // Show stale while reloading so UI stays populated
    const stale = getCacheEntry(cacheKey)
    if (stale) setProducts(stale.products)

    fetchProducts(params)
      .then(({ data }) => {
        if (cancelled) return
        const fresh = Array.isArray(data)
          ? data
          : (data.products ?? data.data ?? data.items ?? data.result ?? [])
        setCacheEntry(cacheKey, fresh)
        seededKey.current = cacheKey
        setProducts(fresh)
        setError(null)
      })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, forceRefresh])

  return { products, loading, error }
}
