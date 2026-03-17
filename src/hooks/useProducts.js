import { useState, useEffect } from 'react'
import { fetchProducts } from '../api/client'

export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    // eslint-disable-next-line no-unused-vars
    fetchProducts(params)
      .then(({ data }) => { if (!cancelled) { setProducts(data.products || []); setError(null) } })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { products, loading, error }
}
