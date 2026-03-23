import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function ShoppingCart({ isOpen, onClose, onCheckout }) {
  const { items, removeItem, updateQty, subtotal } = useCart()
  const shipping = items.length > 0 ? 500 : 0
  const total = subtotal + shipping

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md z-50 flex flex-col rounded-l-2xl backdrop-blur-xl"
            style={{
              background: 'var(--surface-cart)',
              boxShadow: 'var(--shadow-cart)',
              borderLeft: '1px solid var(--border-default)',
            }}
          >
            {/* Top inner highlight */}
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--border-default), transparent)' }} />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{
                borderBottom: '1px solid var(--border-default)',
                background: 'var(--inset-highlight)',
              }}
            >
              <div>
                <h2 className="text-xl font-bold text-emboss">Shopping Cart</h2>
                <p className="text-xs text-muted mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={onClose} className="p-2 text-muted hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted gap-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors rounded-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item._cartKey}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex gap-3 p-3 rounded-lg hover:shadow-md transition-all duration-300"
                      style={{
                        background: 'var(--surface-item-card)',
                        border: '1px solid var(--border-item)',
                        boxShadow: '0 1px 0 var(--inset-highlight) inset, 0 4px 12px -4px rgba(0,0,0,0.12)',
                      }}
                    >
                      <Link to={`/product/${item.id}`} onClick={onClose}>
                        <img src={item.image} alt={item.name} className="w-[72px] h-20 object-cover rounded-lg" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} onClick={onClose}>
                          <p className="text-sm font-semibold line-clamp-1 hover:text-accent transition-colors">{item.name}</p>
                        </Link>
                        <p className="text-xs text-muted mt-0.5">{item.selectedColor} · {item.selectedSize}</p>
                        <p className="text-sm font-bold text-accent mt-1">Rs {item.price.toLocaleString()}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item._cartKey, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-secondary hover:bg-accent hover:text-white transition-colors text-sm font-bold rounded-lg"
                          >−</button>
                          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item._cartKey, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-secondary hover:bg-accent hover:text-white transition-colors text-sm font-bold rounded-lg"
                          >+</button>
                          <button
                            onClick={() => removeItem(item._cartKey)}
                            className="ml-auto text-muted/50 hover:text-accent transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-6 py-5 space-y-4"
                style={{
                  borderTop: '1px solid var(--border-default)',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(200,16,46,0.03) 100%)',
                }}
              >
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping</span><span>Rs {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: '1px solid var(--border-default)' }}>
                    <span>Total</span>
                    <span className="text-accent" style={{ textShadow: '0 0 16px rgba(200,16,46,0.5)' }}>Rs {total.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  onClick={onCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-accent text-white font-bold hover:bg-accent-hover transition-colors accent-glow rounded-xl"
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
