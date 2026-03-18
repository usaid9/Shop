import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories, products } from '../data/products'
import Breadcrumb from '../components/Breadcrumb'
import CategoryIcon from '../components/CategoryIcon'
import ScrollFloat from '../components/ScrollFloat'

const collectionImages = {
  shirts:      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&h=500&fit=crop&q=80',
  trousers:    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=500&fit=crop&q=80',
  jackets:     'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=500&fit=crop&q=80',
  shoes:       'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=500&fit=crop&q=80',
  watches:     'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=500&fit=crop&q=80',
  accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=500&fit=crop&q=80',
  kurta:       'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=500&fit=crop&q=80',
}

export default function CollectionsPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const cols = categories.filter(c => c.id !== 'all')

  return (
    <div className="pt-[68px] min-h-screen">
      {/* Header */}
      <div className="py-10 px-4 sm:px-6 lg:px-8"
        style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-cart)", boxShadow: "inset 0 1px 0 var(--inset-highlight)" }}>
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-4">
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Curated For You
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              <ScrollFloat scrollOffset={['start 95%', 'start 60%']}>Our </ScrollFloat>
              <ScrollFloat scrollOffset={['start 95%', 'start 55%']} accentWords={['Collections']}>Collections</ScrollFloat>
            </h1>
            <p className="text-muted mt-3 text-sm max-w-md">
              Each collection is carefully curated to bring you the finest men's fashion for every occasion.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cols.map((cat, i) => {
              const img = collectionImages[cat.id]
              const topProducts = products.filter(p => p.category === cat.id).slice(0, 3)
              const minPrice = Math.min(...products.filter(p => p.category === cat.id).map(p => p.price))

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/shop/${cat.id}`}
                    className="group block relative overflow-hidden bg-secondary border-subtle-themed hover:border-accent/25 transition-all duration-300 card-depth rounded-xl"
                  >
                    {/* Top highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none z-10" />

                    {/* Image */}
                    <div className="relative overflow-hidden rounded-t-xl" style={{ aspectRatio: '16/9' }}>
                      <motion.img
                        src={img}
                        alt={cat.label}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 w-10 h-10 flex items-center justify-center backdrop-blur-sm text-foreground rounded-lg" style={{ border: "1px solid var(--border-default)", background: "rgba(0,0,0,0.35)" }}>
                        <CategoryIcon id={cat.id} className="w-5 h-5" />
                      </div>
                      <div className="absolute top-4 right-4 bg-accent text-white text-[10px] px-2.5 py-1 font-bold tracking-wide rounded-md">
                        {cat.count} items
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-display text-xl font-bold mb-1 group-hover:text-accent transition-colors duration-200">{cat.label}</h3>
                      <p className="text-muted text-xs mb-4 font-mono">From Rs {minPrice.toLocaleString()}</p>
                      <div className="flex -space-x-2.5 mb-4">
                        {topProducts.map(p => (
                          <img key={p.id} src={p.image} alt={p.name}
                            className="w-9 h-9 object-cover border-2 border-secondary rounded-lg" />
                        ))}
                        {cat.count > 3 && (
                          <div className="w-9 h-9 bg-accent flex items-center justify-center text-[10px] font-bold border-2 border-secondary text-white rounded-lg">
                            +{cat.count - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-accent text-xs font-semibold flex items-center gap-1.5 underline-hover">
                        Explore {cat.label}
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Seasonal banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden"
        style={{ background: 'var(--surface-footer)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(200,16,46,0.08) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/[0.07] to-transparent" />
          <div className="absolute top-0 right-1/3 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/[0.07] to-transparent" />
          <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-accent/20" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-accent/20" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-accent/20" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-accent/20" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
          <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-5 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-accent/40" /> Season Drop <span className="w-8 h-px bg-accent/40" />
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 text-emboss">
            <ScrollFloat scrollOffset={['start 90%', 'start 45%']}>Summer </ScrollFloat>
            <ScrollFloat scrollOffset={['start 88%', 'start 42%']} accentWords={['2025']}>2025</ScrollFloat>
          </h2>
          <p className="text-muted mb-8 text-sm max-w-xs mx-auto">Light fabrics, bold style — built for Pakistani summers</p>
          <Link to="/shop">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-accent text-white font-semibold text-sm tracking-wide hover:bg-accent-hover transition-colors rounded-xl accent-glow">
              Explore All Collections
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
