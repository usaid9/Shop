import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import ProductCard from '../components/ProductCard'
import { GhostProductDetail, GhostCard } from '../components/GhostCard'
import Breadcrumb from '../components/Breadcrumb'
import ScrollFloat from '../components/ScrollFloat'
import { fetchProductById } from '../api/client'
import { useProducts } from '../hooks/useProducts'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()

  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedSize,  setSelectedSize]  = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity,      setQuantity]      = useState(1)
  const [added,         setAdded]         = useState(false)

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchProductById(id)
      .then(({ data }) => {
        setProduct(data)
        setSelectedSize(data.sizes?.[0] || '')
        setSelectedColor(data.colors?.[0] || '')
        setNotFound(false)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const { products: related } = useProducts(
    product ? { category: product.category } : {}
  )
  const relatedFiltered = related.filter(p => (p._id || p.id) !== id).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return
    const productPayload = { ...product, id: product._id || product.id }
    // addItem increments by 1 each call — loop to honour the selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem(productPayload, selectedSize, selectedColor)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (loading) return <GhostProductDetail />

  if (notFound) return (
    <div className="pt-[68px] min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold mb-3">Product Not Found</h2>
        <p className="text-muted mb-6">This product doesn't exist or has been removed.</p>
        <Link to="/shop" className="px-6 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors">
          Browse Shop
        </Link>
      </div>
    </div>
  )

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="pt-[68px] min-h-screen]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: product.category.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase()), to: `/shop/${product.category}` },
          { label: product.name },
        ]} />

        <div className="grid md:grid-cols-2 gap-10 mt-8">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-2xl border-themed" style={{ aspectRatio: '3/4' }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {discount && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-white text-sm font-bold rounded-full">
                -{discount}%
              </div>
            )}
            {product.newArrival && (
              <div className="absolute top-4 right-4 px-3 py-1 backdrop-blur text-foreground text-xs font-bold rounded-full uppercase tracking-wider" style={{ background: "var(--surface-item-card)", border: "1px solid var(--border-default)" }}>
                New
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5 py-2">
            <div>
              <p className="text-[10px]  tracking-widest text-accent font-semibold mb-2 capitalize">{product.category.replace(/-/g,' ')}</p>
              <ScrollFloat><h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">{product.name}</h1></ScrollFloat>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-accent">Rs {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted line-through">Rs {product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            {product.description && (
              <p className="text-muted text-sm leading-relaxed">{product.description}</p>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        selectedSize === s ? 'bg-accent/20 text-accent border-accent/40' : 'border-themed text-muted hover:text-foreground'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        selectedColor === c ? 'bg-accent/20 text-accent border-accent/40' : 'border-themed text-muted hover:text-foreground'
                      }`}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl text-foreground transition-colors flex items-center justify-center" style={{ border: '1px solid var(--border-default)' }}>−</button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 rounded-xl text-foreground transition-colors flex items-center justify-center" style={{ border: '1px solid var(--border-default)' }}>+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${
                  added ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                  : product.inStock ? 'bg-accent text-white hover:bg-accent/90 accent-glow'
                  : 'text-muted cursor-not-allowed border-themed'
                }`}>
                {added ? '✓ Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>

              {/* Wishlist toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleItem({ ...product, id: product._id })}
                className="w-14 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center flex-shrink-0"
                style={{
                  border: '1px solid var(--border-default)',
                  background: isWishlisted(product._id)
                    ? 'rgba(200,16,46,0.1)'
                    : 'transparent',
                  borderColor: isWishlisted(product._id)
                    ? 'rgba(200,16,46,0.3)'
                    : 'var(--border-default)',
                }}
                aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <svg
                  className="w-5 h-5 transition-all duration-200"
                  fill={isWishlisted(product._id) ? '#c8102e' : 'none'}
                  stroke={isWishlisted(product._id) ? '#c8102e' : 'currentColor'}
                  strokeWidth={1.8} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedFiltered.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedFiltered.map(p => (
                <ProductCard key={p._id} product={{...p, id: p._id}} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
