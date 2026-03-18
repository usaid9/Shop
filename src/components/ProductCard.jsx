import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'

function WishlistHeart({ product }) {
  const { isWishlisted, toggleItem } = useWishlist()
  const [popped, setPopped] = useState(false)
  const saved = isWishlisted(product._id || product.id)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
    if (!saved) {
      setPopped(true)
      setTimeout(() => setPopped(false), 400)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
        saved ? 'wishlist-btn-active' : 'opacity-0 group-hover:opacity-100'
      }`}
      style={{
        background: saved ? 'rgba(200,16,46,0.15)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(6px)',
        border: saved ? '1px solid rgba(200,16,46,0.3)' : '1px solid rgba(255,255,255,0.1)',
      }}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <svg
        className={`w-4 h-4 transition-all duration-200 ${popped ? 'animate-heart-pop' : ''}`}
        fill={saved ? '#c8102e' : 'none'}
        stroke={saved ? '#c8102e' : 'white'}
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </motion.button>
  )
}
function TiltCard({ children, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })
  const glareX  = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glareY  = useTransform(y, [-0.5, 0.5], ['0%', '100%'])
  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={className}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.07) 0%, transparent 60%)`
          ),
        }}
      />
      {children}
    </motion.div>
  )
}

export default function ProductCard({ product, listView = false }) {
  const { addItem } = useCart()
  const [showQuick, setShowQuick]         = useState(false)
  const [selectedSize, setSelectedSize]   = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [added, setAdded]                 = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => { setAdded(false); setShowQuick(false) }, 1200)
  }

  // ── LIST VIEW ────────────────────────────────────────────────────────────
  if (listView) {
    return (
      <motion.div
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15 }}
        className="group flex gap-5 bg-secondary hover:border-accent/20 transition-colors p-4 rounded-xl"
        style={{ border: '1px solid var(--border-subtle)' }}
      >
        <Link to={`/product/${product.id}`} className="relative flex-shrink-0 w-24 h-28 overflow-hidden bg-tertiary rounded-lg">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-accent text-white text-[9px] px-1.5 py-0.5 font-bold rounded-md">-{discount}%</span>
          )}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">{product.category}</p>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium text-sm underline-hover text-foreground/90 line-clamp-1">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? 'text-accent' : ''}`} style={{ color: i < Math.floor(product.rating) ? undefined : 'var(--star-empty)' }}>★</span>
              ))}
              <span className="text-[10px] text-muted ml-1">({product.reviews})</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-accent">Rs {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted line-through">Rs {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {product.inStock ? (
              <button
                onClick={() => setShowQuick(true)}
                className="text-xs px-3 py-1.5 text-muted hover:border-accent hover:text-accent transition-colors rounded-lg" style={{ border: "1px solid var(--border-default)" }}
              >
                Quick Add
              </button>
            ) : (
              <span className="text-xs text-muted/50">Out of Stock</span>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // ── GRID VIEW ────────────────────────────────────────────────────────────
  return (
    <TiltCard className="group relative bg-secondary overflow-hidden card-depth rounded-xl cursor-pointer">
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-default), transparent)' }} />

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-tertiary rounded-t-xl" style={{ aspectRatio: '3/4' }}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist heart */}
        <WishlistHeart product={product} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-accent text-white text-[10px] px-2 py-0.5 font-bold tracking-wide rounded-md">-{discount}%</span>
          )}
          {product.newArrival && (
            <span className="bg-foreground text-primary text-[10px] px-2 py-0.5 font-bold tracking-wide rounded-md">NEW</span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
            <span className="text-white text-xs font-medium tracking-wider uppercase">Sold Out</span>
          </div>
        )}

        {/* Hover overlay for desktop only */}
        {product.inStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
            <button
              onClick={(e) => { e.preventDefault(); setShowQuick(true) }}
              className="w-full py-2.5 bg-foreground text-primary text-xs font-semibold tracking-wider uppercase hover:bg-accent hover:text-white transition-colors duration-200 rounded-lg"
            >
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3.5 pt-3" style={{ background: 'linear-gradient(to bottom, var(--color-secondary), var(--color-tertiary))' }}>
        <p className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1.5">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-1 text-foreground/90 underline-hover">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 mb-2.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? 'text-accent' : ''}`} style={{ color: i < Math.floor(product.rating) ? undefined : 'var(--star-empty)' }}>★</span>
          ))}
          <span className="text-[10px] text-muted ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-accent">Rs {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">Rs {product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {/* Mobile quick add button */}
        {product.inStock && (
          <button
            onClick={(e) => { e.preventDefault(); setShowQuick(true) }}
            className="mt-2 w-full py-2 bg-accent text-white text-xs font-semibold tracking-wider uppercase rounded-lg sm:hidden"
          >
            Quick Add
          </button>
        )}
      </div>

      {/* ── QUICK ADD OVERLAY ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQuick && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col rounded-none sm:rounded-xl overflow-y-auto"
            style={{ background: 'var(--surface-card)', WebkitOverflowScrolling: 'touch' }}
          >
            {/* Top strip — product name + close */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div className="min-w-0 pr-2">
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-0.5">{product.category}</p>
                <p className="text-sm font-bold text-foreground line-clamp-1">{product.name}</p>
              </div>
              <button
                onClick={() => setShowQuick(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-foreground transition-colors flex-shrink-0 fixed top-3 right-3 sm:static sm:w-7 sm:h-7 sm:rounded-lg"
                style={{ background: 'var(--surface-quick-add-close)', zIndex: 60 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-quick-add-close-h)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-quick-add-close)'}
                aria-label="Close quick add"
              >
                <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Size */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-xs sm:text-[10px] font-bold uppercase tracking-widest mb-3 text-muted">Select Size</p>
              <div className="flex flex-wrap gap-2 sm:gap-1.5 mb-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[48px] sm:min-w-[36px] px-3 sm:px-2.5 py-2 sm:py-1.5 text-base sm:text-xs font-semibold transition-all duration-150 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/60 ${
                      selectedSize === s
                        ? 'border-accent bg-accent text-white shadow-[0_0_12px_rgba(200,16,46,0.35)]'
                        : 'text-muted hover:text-foreground'
                    }`}
                    style={{
                      marginBottom: 4,
                      ...(selectedSize !== s ? { borderColor: 'var(--border-default)', background: 'var(--inset-highlight)' } : {}),
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="px-4 pt-2 pb-3">
              <p className="text-xs sm:text-[10px] font-bold uppercase tracking-widest mb-3 text-muted">Select Color</p>
              <div className="flex flex-wrap gap-2 sm:gap-1.5 mb-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`min-w-[48px] sm:min-w-[36px] px-3 sm:px-2.5 py-2 sm:py-1.5 text-base sm:text-xs font-semibold transition-all duration-150 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/60 ${
                      selectedColor === c
                        ? 'border-accent bg-accent text-white shadow-[0_0_12px_rgba(200,16,46,0.35)]'
                        : 'text-muted hover:text-foreground'
                    }`}
                    style={{
                      marginBottom: 4,
                      ...(selectedColor !== c ? { borderColor: 'var(--border-default)', background: 'var(--inset-highlight)' } : {}),
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + Add button */}
            <div className="mt-auto px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--border-default)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-base font-bold text-accent">Rs {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted line-through">Rs {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-1">
                  <span className="text-xs text-muted">Size:</span>
                  <span className="text-xs font-bold text-foreground">{selectedSize}</span>
                  <span className="text-xs text-muted mx-0.5">·</span>
                  <span className="text-xs text-muted">Color:</span>
                  <span className="text-xs font-bold text-foreground">{selectedColor}</span>
                </div>
              </div>
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 text-sm font-bold tracking-wide transition-all duration-200 rounded-xl ${
                  added
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-accent hover:bg-accent/90 text-white accent-glow'
                }`}
              >
                {added ? '✓  Added to Cart' : 'Add to Cart'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TiltCard>
  )
}
