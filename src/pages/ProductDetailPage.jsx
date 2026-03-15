import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import Breadcrumb from '../components/Breadcrumb'
import ScrollFloat from '../components/ScrollFloat'
import { products } from '../data/products'

// Inline SVG delivery icons
const DeliveryIcons = {
  truck: (
    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-7 12h8a2 2 0 002-2v-5l-3-4H13V17m0 0H8m0 0a2 2 0 11-4 0 2 2 0 014 0zm9 0a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  refresh: (
    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCart()

  const product = products.find(p => p.id === id)
  const [selectedSize, setSelectedSize]   = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab]     = useState('desc')

  useEffect(() => {
    window.scrollTo(0, 0)
    if (product) {
      setSelectedSize(product.sizes[0])
      setSelectedColor(product.colors[0])
    }
  }, [id, product])

  if (!product) return (
    <div className="pt-28 text-center min-h-screen flex flex-col items-center justify-center gap-5">
      <svg className="w-16 h-16 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" strokeWidth={1.2} />
        <path strokeLinecap="round" strokeWidth={1.2} d="M21 21l-4.35-4.35" />
      </svg>
      <h2 className="font-display text-3xl font-bold">Product not found</h2>
      <Link to="/shop" className="text-accent text-sm underline-hover">← Back to Shop</Link>
    </div>
  )

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), to: `/shop/${product.category}` },
    { label: product.name },
  ]

  const deliveryInfo = [
    { icon: 'truck',   text: 'Free delivery on orders above Rs 5,000' },
    { icon: 'clock',   text: '3–5 business days across Pakistan' },
    { icon: 'refresh', text: '7-day easy returns & exchanges' },
    { icon: 'shield',  text: 'Secure via JazzCash / EasyPaisa / COD' },
  ]

  return (
    <div className="pt-[68px] min-h-screen">
      {/* Breadcrumb bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/[0.06] bg-secondary/60">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb custom={breadcrumbs} />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: '3/4' }}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-xs font-bold tracking-wide">
                  -{discount}% OFF
                </div>
              )}
              {product.newArrival && (
                <div className="absolute top-4 right-4 bg-foreground text-primary px-3 py-1 text-xs font-bold tracking-wide">
                  NEW
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <Link to={`/shop/${product.category}`} className="text-[10px] font-semibold uppercase tracking-superwide text-accent mb-3 underline-hover hover:text-accent/70 transition-colors w-fit">
              {product.category}
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">{product.name}</h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-accent' : 'text-white/15'}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-muted">{product.rating} · {product.reviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-4xl font-bold text-accent">Rs {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted line-through">Rs {product.originalPrice.toLocaleString()}</span>
                  <span className="text-green-400 text-xs font-semibold px-2 py-0.5 bg-green-400/10 border border-green-400/20">
                    Save Rs {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Size */}
            <div className="mb-5">
              <p className="text-xs text-muted uppercase tracking-wider mb-2.5">
                Size — <span className="text-foreground">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-2 text-sm transition-all duration-150 border font-medium rounded-lg ${
                      selectedSize === s
                        ? 'border-accent bg-accent text-white'
                        : 'border-white/[0.08] text-muted hover:border-white/30 hover:text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-8">
              <p className="text-xs text-muted uppercase tracking-wider mb-2.5">
                Color — <span className="text-foreground">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-2 text-sm transition-all duration-150 border font-medium rounded-lg ${
                      selectedColor === c
                        ? 'border-accent bg-accent text-white'
                        : 'border-white/[0.08] text-muted hover:border-white/30 hover:text-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + CTA */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors text-lg">−</button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-11 flex items-center justify-center text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors text-lg">+</button>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 py-3 font-semibold text-sm tracking-wide transition-colors duration-200 rounded-xl ${
                  added
                    ? 'bg-green-700 text-white'
                    : product.inStock
                    ? 'bg-accent text-white hover:bg-accent-hover accent-glow'
                    : 'bg-white/[0.05] text-muted/40 cursor-not-allowed'
                }`}
              >
                {added ? '✓  Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>
            </div>

            {/* Delivery info */}
            <div className="border border-white/[0.06] divide-y divide-white/[0.04] rounded-xl overflow-hidden">
              {deliveryInfo.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 px-4 py-3">
                  {DeliveryIcons[icon]}
                  <span className="text-xs text-muted">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-white/[0.06]">
            {[
              { id: 'desc', label: 'Description' },
              { id: 'details', label: 'Details' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-6 py-3.5 text-sm font-medium transition-colors duration-200 ${
                  tab === t.id ? 'text-foreground' : 'text-muted hover:text-foreground'
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-accent"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8 text-muted text-sm leading-relaxed max-w-2xl">
            {tab === 'desc' && <p>{product.description}</p>}
            {tab === 'details' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Category', product.category],
                  ['Sizes', product.sizes.join(', ')],
                  ['Colors', product.colors.join(', ')],
                  ['Rating', `${product.rating}/5 (${product.reviews} reviews)`],
                  ['Availability', product.inStock ? 'In Stock' : 'Out of Stock'],
                  ['SKU', `PRE-${product.id.padStart(4, '0')}`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-secondary border border-white/[0.04] p-3.5">
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">{k}</p>
                    <p className="text-foreground/90 text-sm font-medium capitalize">{v}</p>
                  </div>
                ))}
              </div>
            )}
            {tab === 'shipping' && (
              <div className="space-y-4">
                {[
                  { label: 'Standard Delivery', text: '3–5 business days. Rs 500 flat rate. Free above Rs 5,000.' },
                  { label: 'Express Delivery', text: '1–2 days in Karachi, Lahore, Islamabad. Rs 1,000.' },
                  { label: 'Returns', text: '7-day return window. Unused with original tags. WhatsApp 0300-1234567 to initiate.' },
                ].map(({ label, text }) => (
                  <div key={label}>
                    <p className="font-semibold text-foreground/90 mb-1">{label}</p>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/[0.06]">
            <h2 className="font-display text-3xl font-bold mb-8">
              <ScrollFloat scrollOffset={['start 95%', 'start 55%']}>You May Also </ScrollFloat>
              <ScrollFloat scrollOffset={['start 93%', 'start 52%']} accentWords={['Like']}>Like</ScrollFloat>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
