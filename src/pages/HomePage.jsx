import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThreeDBackground from '../components/ThreeDBackground'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import CategoryIcon from '../components/CategoryIcon'
import ScrollFloat from '../components/ScrollFloat'
import { products, categories } from '../data/products'

const featured    = products.filter(p => p.featured).slice(0, 8)
const newArrivals = products.filter(p => p.newArrival).slice(0, 4)

function SectionTitle({ eyebrow, title, accent, sub, align = 'left' }) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-3 flex items-center gap-2"
          style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}
        >
          <span className="w-5 h-px bg-accent" />
          {eyebrow}
        </motion.p>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
        <ScrollFloat scrollOffset={['start 95%', 'start 55%']}>
          {title}
        </ScrollFloat>
        {accent && (
          <>
            {' '}
            <ScrollFloat scrollOffset={['start 95%', 'start 50%']} accentWords={accent.trim().split(' ')}>
              {accent}
            </ScrollFloat>
          </>
        )}
      </h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted mt-3 text-sm max-w-sm"
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}

export default function HomePage() {
  const productsRef = useRef(null)

  return (
    <div className="relative">
      <ThreeDBackground />
      <div className="relative z-10">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <Hero onShopClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })} />

        {/* ── Shop by Category ──────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary relative section-depth">
          {/* Subtle dot-grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
            }}
          />
          <div className="max-w-7xl mx-auto relative">
            <SectionTitle eyebrow="Browse" title="Shop by" accent="Category" align="left" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.filter(c => c.id !== 'all').map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/shop/${cat.id}`}
                    className="group flex flex-col items-start gap-3 p-5 panel-inset border border-white/[0.05] hover:border-accent/30 transition-all duration-300 rounded-xl"
                  >
                    <div className="w-10 h-10 flex items-center justify-center border border-white/[0.08] group-hover:border-accent/50 text-muted group-hover:text-accent transition-all duration-300 bg-white/[0.02] group-hover:bg-accent/[0.06] rounded-lg">
                      <CategoryIcon id={cat.id} className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground/90 group-hover:text-foreground transition-colors">{cat.label}</p>
                      <p className="text-[10px] text-muted mt-0.5 font-mono">{cat.count} items</p>
                    </div>
                    <span className="text-[10px] text-muted/0 group-hover:text-accent transition-colors flex items-center gap-1">
                      Shop
                      <svg className="w-3 h-3 -translate-x-1 group-hover:translate-x-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ─────────────────────────────────────────── */}
        <section ref={productsRef} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0d0d0d 0%, #101010 50%, #0a0a0a 100%)' }}>
          {/* Side accent glow */}
          <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.06) 0%, transparent 70%)' }} />
          <div className="absolute -right-40 top-1/3 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.04) 0%, transparent 70%)' }} />
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <SectionTitle eyebrow="Handpicked" title="Featured" accent="Picks" sub="Premium pieces selected for the modern man" />
              <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-sm text-muted underline-hover hover:text-accent transition-colors mb-10">
                View All
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/shop" className="text-sm text-accent underline-hover">View All Products</Link>
            </div>
          </div>
        </section>

        {/* ── Eid Banner ────────────────────────────────────────────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0608 40%, #0a0408 60%, #080808 100%)', borderTop: '1px solid rgba(200,16,46,0.15)', borderBottom: '1px solid rgba(200,16,46,0.15)' }}>
          {/* Deep radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(200,16,46,0.09) 0%, transparent 70%)' }} />
          {/* Decorative corner lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/[0.08] to-transparent" />
            <div className="absolute top-0 right-1/4 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/[0.08] to-transparent" />
            {/* Corner accents */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-accent/20" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-accent/20" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-accent/20" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-accent/20" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-5 flex items-center justify-center gap-2">
                <span className="w-8 h-px bg-accent/40" />
                Limited Time Offer
                <span className="w-8 h-px bg-accent/40" />
              </p>
              <h2 className="font-display text-5xl md:text-7xl font-bold mb-4 leading-tight text-emboss">
                <ScrollFloat scrollOffset={['start 90%', 'start 40%']}>
                  Eid Special
                </ScrollFloat>
                <br />
                <span className="text-accent italic" style={{ textShadow: '0 0 30px rgba(200,16,46,0.45), 0 0 60px rgba(200,16,46,0.2)' }}>
                  <ScrollFloat scrollOffset={['start 85%', 'start 35%']} accentWords={['Up','to','30%','Off']}>
                    Up to 30% Off
                  </ScrollFloat>
                </span>
              </h2>
              <p className="text-muted mb-10 text-sm max-w-sm mx-auto leading-relaxed">
                On our premium Kurta &amp; Shalwar collection — delivered before Eid, guaranteed.
              </p>
              <Link to="/shop/kurta">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-12 py-4 bg-accent text-white font-semibold text-sm tracking-wide hover:bg-accent-hover transition-colors animate-glow rounded-xl"
                >
                  Shop Kurta Collection
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── New Arrivals ──────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <SectionTitle eyebrow="Just Landed" title="New" accent="Arrivals" sub="Fresh drops, just in" />
              <Link to="/shop?filter=new" className="hidden sm:flex items-center gap-1.5 text-sm text-muted underline-hover hover:text-accent transition-colors mb-10">
                See All
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
