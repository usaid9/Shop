import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThreeDBackground from '../components/ThreeDBackground'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { GhostCard, GhostGrid } from '../components/GhostCard'
import CategoryIcon from '../components/CategoryIcon'
import ScrollFloat from '../components/ScrollFloat'
import { useProducts } from '../hooks/useProducts'
import { categories } from '../data/products'

export default function HomePage() {
  const productsRef = useRef(null)
  const { products: featured, loading: loadingFeatured } = useProducts({ featured: 'true', limit: 8 })
  const { products: newArrivals, loading: loadingNew }   = useProducts({ newArrival: 'true', limit: 4 })

  return (
    <div className="min-h-screen">
      <ThreeDBackground />
      <Hero onShopClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 section-divide" style={{ background: 'var(--surface-categories)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-8">
            <ScrollFloat>
              <h2 className="font-display text-3xl font-bold w-full text-center sm:text-left">Shop by <span className="text-accent italic">Category</span></h2>
            </ScrollFloat>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link
                  to={`/shop/${cat.id}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-accent/5 transition-all group"
                  style={{ border: '1px solid var(--border-default)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/20 transition-all"
                    style={{ background: 'var(--inset-highlight)', border: '1px solid var(--border-default)' }}
                  >
                    <CategoryIcon id={cat.id} className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <span className="text-xs text-muted group-hover:text-foreground transition-colors text-center leading-tight">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden section-divide z-10"
        style={{ background: 'var(--surface-footer)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
                <span className="w-5 h-px bg-accent" /> Curated Selection
              </p>
              <ScrollFloat>
                <h2 className="font-display text-4xl font-bold">Featured <span className="text-accent italic">Pieces</span></h2>
              </ScrollFloat>
            </div>
            <Link to="/shop" className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1 group">
              View all <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>
          {loadingFeatured
            ? <GhostGrid count={8} />
            : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featured.map((p, i) => (
                  <motion.div key={p._id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}}>
                    <ProductCard product={{...p, id: p._id}} />
                  </motion.div>
                ))}
              </div>
            )
          }
        </div>
      </section>

      {/* New Arrivals */}
      {(loadingNew || newArrivals.length > 0) && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 section-divide" style={{ background: 'var(--surface-categories)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
                  <span className="w-5 h-px bg-accent" /> Just Dropped
                </p>
                <ScrollFloat>
                  <h2 className="font-display text-4xl font-bold">New <span className="text-accent italic">Arrivals</span></h2>
                </ScrollFloat>
              </div>
              <Link to="/shop?filter=new" className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1 group">
                See all <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>
            {loadingNew
              ? <GhostGrid count={4} cols="grid-cols-2 sm:grid-cols-4" />
              : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {newArrivals.map((p, i) => (
                    <motion.div key={p._id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}}>
                      <ProductCard product={{...p, id: p._id}} />
                    </motion.div>
                  ))}
                </div>
              )
            }
          </div>
        </section>
      )}
    </div>
  )
}
