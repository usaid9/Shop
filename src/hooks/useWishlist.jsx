import React from 'react'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'ppk-wishlist'

function readStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readStorage)

  // Persist on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  const addItem = useCallback((product) => {
    setItems(prev =>
      prev.find(i => i._id === product._id || i.id === product.id)
        ? prev
        : [...prev, { ...product, id: product._id || product.id }]
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i._id !== id && i.id !== id))
  }, [])

  const toggleItem = useCallback((product) => {
    const id = product._id || product.id
    setItems(prev =>
      prev.find(i => i._id === id || i.id === id)
        ? prev.filter(i => i._id !== id && i.id !== id)
        : [...prev, { ...product, id }]
    )
  }, [])

  const isWishlisted = useCallback((id) =>
    items.some(i => i._id === id || i.id === id),
  [items])

  const clearWishlist = useCallback(() => setItems([]), [])

  return (
    <WishlistContext.Provider value={{
      items,
      wishlistCount: items.length,
      addItem, removeItem, toggleItem, isWishlisted, clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider')
  return ctx
}
