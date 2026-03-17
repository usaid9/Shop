import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import Breadcrumb from '../components/Breadcrumb'
import ScrollFloat from '../components/ScrollFloat'
import { fetchProductById } from '../api/client'
import { useProducts } from '../hooks/useProducts'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedSize,  setSelectedSize]  = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity,      setQuantity]      = useState(1)
  const [added,         setAdded]         = useState(false)

  useEffect(() => {
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
  const relatedFiltered = related.filter(p => p._id !== id).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return
    addToCart({ ...product, id: product._id, selectedSize, selectedColor, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (loading) return (
    <div className="pt-[68px] min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="bg-white/[0.06] rounded-2xl" style={{ aspectRatio: '3/4' }} />
        <div className="space-y-4 pt-4">
          <div className="bg-white/[0.06] rounded h-4 w-1/3" />
          <div className="bg-white/[0.06] rounded h-10 w-3/4" />
          <div className="bg-white/[0.06] rounded h-6 w-1/4" />
          <div className="bg-white/[0.06] rounded h-20 w-full" />
        </div>
      </div>
    </div>
  )

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
    <div className="pt-[68px] min-h-screen">
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
            className="relative overflow-hidden rounded-2xl border border-white/[0.06]" style={{ aspectRatio: '3/4' }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {discount && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-white text-sm font-bold rounded-full">
                -{discount}%
              </div>
            )}
            {product.newArrival && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                New
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5 py-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2 capitalize">{product.category.replace(/-/g,' ')}</p>
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
                        selectedSize === s ? 'bg-accent/20 text-accent border-accent/40' : 'border-white/[0.08] text-muted hover:border-white/20 hover:text-foreground'
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
                        selectedColor === c ? 'bg-accent/20 text-accent border-accent/40' : 'border-white/[0.08] text-muted hover:border-white/20 hover:text-foreground'
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
                  className="w-9 h-9 rounded-xl border border-white/[0.08] text-foreground hover:border-white/20 transition-colors flex items-center justify-center">−</button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 rounded-xl border border-white/[0.08] text-foreground hover:border-white/20 transition-colors flex items-center justify-center">+</button>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                added ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                : product.inStock ? 'bg-accent text-white hover:bg-accent/90 accent-glow'
                : 'bg-white/[0.04] text-muted cursor-not-allowed border border-white/[0.06]'
              }`}>
              {added ? '✓ Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>
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
