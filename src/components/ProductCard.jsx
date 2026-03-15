import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useCart } from '../hooks/useCart'

// ── 3D tilt wrapper — only active on non-touch devices ───────────────────────
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
      {/* Glare layer */}
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
  const [showQuick, setShowQuick]     = useState(false)
  const [selectedSize, setSelectedSize]   = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [added, setAdded] = useState(false)

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
        className="group flex gap-5 bg-secondary border border-white/[0.04] hover:border-white/[0.1] transition-colors p-4 rounded-xl"
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
                <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? 'text-accent' : 'text-white/15'}`}>★</span>
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
                className="text-xs px-3 py-1.5 border border-white/10 text-muted hover:border-accent hover:text-accent transition-colors rounded-lg"
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none z-10" />

      {/* Image container */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-tertiary rounded-t-xl" style={{ aspectRatio: '3/4' }}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

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
          <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
            <span className="text-white/80 text-xs font-medium tracking-wider uppercase">Sold Out</span>
          </div>
        )}

        {/* Hover overlay with Quick Add */}
        {product.inStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
      <div className="p-3.5 pt-3 bg-gradient-to-b from-secondary to-[#111111]">
        <p className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1.5">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-1 text-foreground/90 underline-hover">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 mb-2.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? 'text-accent' : 'text-white/15'}`}>★</span>
          ))}
          <span className="text-[10px] text-muted ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-accent">Rs {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">Rs {product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuick && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-secondary/98 backdrop-blur-sm z-30 flex flex-col p-4 rounded-xl"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-semibold line-clamp-1 pr-4">{product.name}</p>
              <button onClick={() => setShowQuick(false)} className="text-muted hover:text-foreground flex-shrink-0 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Size</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1 text-xs transition-all duration-150 border rounded-lg ${
                    selectedSize === s ? 'border-accent bg-accent text-white' : 'border-white/[0.08] text-muted hover:border-white/30 hover:text-foreground'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Color</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.colors.map(c => (
                <button key={c} onClick={() => setSelectedColor(c)}
                  className={`px-2.5 py-1 text-xs transition-all duration-150 border rounded-lg ${
                    selectedColor === c ? 'border-accent bg-accent text-white' : 'border-white/[0.08] text-muted hover:border-white/30 hover:text-foreground'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
            <motion.button onClick={handleAdd} whileTap={{ scale: 0.98 }}
              className={`mt-auto py-2.5 text-sm font-semibold tracking-wide transition-colors duration-200 rounded-lg ${
                added ? 'bg-green-700 text-white' : 'bg-accent hover:bg-accent-hover text-white'
              }`}>
              {added ? '✓  Added to Cart' : 'Add to Cart'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </TiltCard>
  )
}
