import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useWishlist } from '../hooks/useWishlist'
import { useCart } from '../hooks/useCart'

export default function WishlistPanel({ isOpen, onClose }) {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleMoveToCart = (item) => {
    addItem(item, item.sizes?.[0] || 'M', item.colors?.[0] || 'Default')
    removeItem(item.id || item._id)
  }

  const handleMoveAll = () => {
    items.forEach(item =>
      addItem(item, item.sizes?.[0] || 'M', item.colors?.[0] || 'Default')
    )
    clearWishlist()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm z-40"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md z-50 flex flex-col rounded-l-2xl"
            style={{
              background: 'var(--surface-cart)',
              boxShadow: 'var(--shadow-cart)',
              borderLeft: '1px solid var(--border-default)',
            }}
          >
            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--border-default), transparent)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--inset-highlight)' }}>
              <div>
                <h2 className="text-xl font-bold text-emboss flex items-center gap-2">
                  <HeartIcon filled className="w-5 h-5 text-accent" />
                  Wishlist
                </h2>
                <p className="text-xs text-muted mt-0.5">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={onClose} className="p-2 text-muted hover:text-foreground transition-colors" aria-label="Close wishlist">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-5 text-center">
                  {/* Empty heart illustration */}
                  <div className="relative">
                    <svg className="w-20 h-20 text-muted/20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">?</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Nothing saved yet</p>
                    <p className="text-xs text-muted max-w-[200px]">Tap the heart on any product to save it for later</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl accent-glow hover:bg-accent/90 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id || item._id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{
                        background: 'var(--surface-item-card)',
                        border: '1px solid var(--border-item)',
                        boxShadow: '0 1px 0 var(--inset-highlight) inset, 0 4px 12px -4px rgba(0,0,0,0.12)',
                      }}
                    >
                      <Link to={`/product/${item.id || item._id}`} onClick={onClose} className="flex-shrink-0">
                        <img
                          src={item.image} alt={item.name}
                          className="w-[68px] h-20 object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-0.5">{item.category}</p>
                          <Link to={`/product/${item.id || item._id}`} onClick={onClose}>
                            <p className="text-sm font-semibold line-clamp-1 hover:text-accent transition-colors">{item.name}</p>
                          </Link>
                          <p className="text-sm font-bold text-accent mt-1">Rs {item.price?.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="flex-1 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeItem(item.id || item._id)}
                            className="p-1.5 text-muted hover:text-accent transition-colors rounded-lg"
                            aria-label="Remove from wishlist"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — move all to cart */}
            {items.length > 0 && (
              <div className="px-6 py-5 space-y-3"
                style={{ borderTop: '1px solid var(--border-default)', background: 'linear-gradient(180deg, transparent 0%, rgba(200,16,46,0.03) 100%)' }}>
                <motion.button
                  onClick={handleMoveAll}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-accent text-white font-bold text-sm hover:bg-accent/90 transition-colors accent-glow rounded-xl"
                >
                  Move All to Cart ({items.length})
                </motion.button>
                <button
                  onClick={clearWishlist}
                  className="w-full py-2 text-xs text-muted hover:text-accent transition-colors"
                >
                  Clear wishlist
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function HeartIcon({ filled, className }) {
  return (
    <svg className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}
