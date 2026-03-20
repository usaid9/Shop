import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-accent rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  // Pre-load all products into cache silently — zero cost on search
  const { products: allProducts } = useProducts({})

  // Filter locally — instant, no API call
  const results = query.trim().length < 1 ? [] : allProducts.filter(p => {
    const q = query.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }).slice(0, 8)

  // Auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setActiveIdx(-1)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Keyboard nav
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) {
        navigate(`/product/${results[activeIdx]._id}`)
        onClose()
      } else if (query.trim()) {
        navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
        onClose()
      }
    }
  }, [activeIdx, results, query, navigate, onClose])

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx]
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — subtle, not a full modal dim */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[55]"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />

          {/* Panel — drops down from header */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 right-0 z-[56] mx-auto max-w-2xl px-4"
            style={{ top: 76 }}
          >
            <div
              className="rounded-2xl overflow-hidden backdrop-blur-xl"
              style={{
                background: 'rgba(8, 8, 8, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              {/* Input row */}
              <div className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: results.length > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
                <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setActiveIdx(-1) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, categories…"
                  className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted/50"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => { setQuery(''); inputRef.current?.focus() }}
                    className="text-muted hover:text-foreground transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-muted rounded"
                  style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-default)' }}>
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <ul ref={listRef} className="py-1.5 max-h-[60vh] overflow-y-auto">
                      {results.map((product, i) => (
                        <li key={product._id}>
                          <Link
                            to={`/product/${product._id}`}
                            onClick={onClose}
                            onMouseEnter={() => setActiveIdx(i)}
                            className="flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-accent/5"
                            style={{
                              background: activeIdx === i ? 'rgba(200,16,46,0.1)' : 'transparent',
                              borderLeft: activeIdx === i ? '3px solid var(--color-accent)' : '3px solid transparent',
                            }}
                          >
                            {/* Thumbnail */}
                            <div className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0"
                              style={{ background: 'var(--color-tertiary)' }}>
                              <img src={product.image} alt={product.name}
                                className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-0.5">
                                {product.category?.replace(/-/g, ' ')}
                              </p>
                              <p className="text-sm font-medium line-clamp-1">
                                {highlight(product.name || '', query)}
                              </p>
                            </div>
                            {/* Price */}
                            <span className="text-sm font-bold text-accent flex-shrink-0">
                              Rs {product.price?.toLocaleString()}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Footer hint */}
                    <div className="px-4 py-2.5 flex items-center gap-4"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <span className="text-[10px] text-muted flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: 'var(--border-default)' }}>↑↓</kbd>
                        navigate
                      </span>
                      <span className="text-[10px] text-muted flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: 'var(--border-default)' }}>↵</kbd>
                        open
                      </span>
                      <span className="text-[10px] text-muted ml-auto">{results.length} result{results.length !== 1 ? 's' : ''}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No results */}
              {query.trim().length > 0 && results.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted">No results for <span className="text-foreground font-medium">"{query}"</span></p>
                  <p className="text-xs text-muted/60 mt-1">Try a different keyword</p>
                </div>
              )}

              {/* Empty state hint */}
              {query.trim().length === 0 && (
                <div className="px-4 py-4 flex flex-wrap gap-2">
                  {['Shirts', 'Kurta', 'Jackets', 'Trousers'].map(hint => (
                    <button key={hint}
                      onClick={() => { setQuery(hint); inputRef.current?.focus() }}
                      className="text-xs px-3 py-1.5 rounded-full text-muted hover:text-accent transition-colors"
                      style={{ border: '1px solid var(--border-default)', background: 'var(--inset-highlight)' }}>
                      {hint}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
