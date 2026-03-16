import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import CategoryIcon from './CategoryIcon'
import { categories } from '../data/products'

// ── Custom dropdown ──────────────────────────────────────────────────────────
function Dropdown({ value, onChange, options, prefix = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const active = options.find(o => o.value === value)

  // Close on outside click
  useMemo(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 bg-secondary border font-medium transition-all duration-200 rounded-xl flex-shrink-0 justify-between ${
          open ? 'border-accent text-foreground' : 'border-white/[0.08] text-muted hover:border-white/20 hover:text-foreground'
        }`}
        style={{ fontSize: '0.675rem' }}
      >
        <span>{prefix && <span className="text-muted mr-1 font-normal">{prefix}</span>}{active?.label}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3.5 h-3.5 flex-shrink-0"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'top' }}
            className="absolute top-[calc(100%+4px)] left-0 right-0 sm:right-auto z-30 sm:min-w-[170px] bg-secondary border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden rounded-xl"
          >
            {options.map((opt, i) => (
              <motion.li
                key={opt.value}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.18 }}
              >
                <button
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-[0.775rem] sm:text-sm transition-colors duration-150 ${
                    opt.value === value
                      ? 'text-accent bg-accent/[0.08]'
                      : 'text-muted hover:text-foreground hover:bg-white/[0.04]'
                  }`}
                >
                  {opt.label}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Grid/List toggle icon ────────────────────────────────────────────────────
// Desktop options: 3, 4, 5, list
// Mobile options: 2, list  (3 and 4 hidden on mobile)
function GridToggle({ cols, onChange }) {
  const desktopOpts = [
    {
      id: 3,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 18 18" fill="currentColor">
          <rect x="1" y="1" width="4.5" height="7.5" rx="0.5" />
          <rect x="6.75" y="1" width="4.5" height="7.5" rx="0.5" />
          <rect x="12.5" y="1" width="4.5" height="7.5" rx="0.5" />
          <rect x="1" y="9.5" width="4.5" height="7.5" rx="0.5" />
          <rect x="6.75" y="9.5" width="4.5" height="7.5" rx="0.5" />
          <rect x="12.5" y="9.5" width="4.5" height="7.5" rx="0.5" />
        </svg>
      ),
    },
    {
      id: 4,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <rect x="1" y="1" width="3.5" height="8" rx="0.5" />
          <rect x="5.5" y="1" width="3.5" height="8" rx="0.5" />
          <rect x="10" y="1" width="3.5" height="8" rx="0.5" />
          <rect x="14.5" y="1" width="4.5" height="8" rx="0.5" />
          <rect x="1" y="10" width="3.5" height="9" rx="0.5" />
          <rect x="5.5" y="10" width="3.5" height="9" rx="0.5" />
          <rect x="10" y="10" width="3.5" height="9" rx="0.5" />
          <rect x="14.5" y="10" width="4.5" height="9" rx="0.5" />
        </svg>
      ),
    },
    {
      id: 5,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 22 22" fill="currentColor">
          <rect x="1" y="1" width="3" height="8.5" rx="0.5" />
          <rect x="5" y="1" width="3" height="8.5" rx="0.5" />
          <rect x="9" y="1" width="3" height="8.5" rx="0.5" />
          <rect x="13" y="1" width="3" height="8.5" rx="0.5" />
          <rect x="17" y="1" width="4" height="8.5" rx="0.5" />
          <rect x="1" y="11" width="3" height="9" rx="0.5" />
          <rect x="5" y="11" width="3" height="9" rx="0.5" />
          <rect x="9" y="11" width="3" height="9" rx="0.5" />
          <rect x="13" y="11" width="3" height="9" rx="0.5" />
          <rect x="17" y="11" width="4" height="9" rx="0.5" />
        </svg>
      ),
    },
    {
      id: 'list',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="14" height="3" rx="0.5" />
          <rect x="1" y="6.5" width="14" height="3" rx="0.5" />
          <rect x="1" y="11" width="14" height="3" rx="0.5" />
        </svg>
      ),
    },
  ]

  // Mobile: only 2-col and list
  const mobileOpts = [
    {
      id: 2,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="0.5" />
          <rect x="9" y="1" width="6" height="6" rx="0.5" />
          <rect x="1" y="9" width="6" height="6" rx="0.5" />
          <rect x="9" y="9" width="6" height="6" rx="0.5" />
        </svg>
      ),
    },
    {
      id: 'list',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="14" height="3" rx="0.5" />
          <rect x="1" y="6.5" width="14" height="3" rx="0.5" />
          <rect x="1" y="11" width="14" height="3" rx="0.5" />
        </svg>
      ),
    },
  ]

  const btnClass = (id) =>
    `p-1.5 transition-colors duration-150 rounded-lg ${
      cols === id ? 'text-accent bg-accent/[0.1]' : 'text-muted hover:text-foreground'
    }`

  return (
    <>
      {/* Desktop toggle — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-0.5 border border-white/[0.08] p-1 rounded-xl">
        {desktopOpts.map(opt => (
          <button key={opt.id} onClick={() => onChange(opt.id)}
            className={btnClass(opt.id)}
            title={opt.id === 'list' ? 'List view' : `${opt.id}-column grid`}>
            {opt.icon}
          </button>
        ))}
      </div>
      {/* Mobile toggle — 2-col and list only */}
      <div className="flex sm:hidden items-center gap-0.5 border border-white/[0.08] p-1 rounded-xl">
        {mobileOpts.map(opt => (
          <button key={opt.id} onClick={() => onChange(opt.id)}
            className={btnClass(opt.id)}
            title={opt.id === 'list' ? 'List view' : '2-column grid'}>
            {opt.icon}
          </button>
        ))}
      </div>
    </>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'new',        label: 'New Arrivals' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Highest Rated' },
]

const PRICE_OPTIONS = [
  { value: 'all',      label: 'All Prices' },
  { value: 'under5k',  label: 'Under Rs 5,000' },
  { value: '5k-10k',   label: 'Rs 5,000 – 10,000' },
  { value: 'over10k',  label: 'Over Rs 10,000' },
]

export default function ProductGrid({ products, showFilters = true, title, subtitle }) {
  const [selectedCat, setSelectedCat] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState('all')
  const [gridCols, setGridCols] = useState(4)

  const filtered = useMemo(() => {
    let list = selectedCat === 'all' ? products : products.filter(p => p.category === selectedCat)
    if (priceRange === 'under5k') list = list.filter(p => p.price < 5000)
    else if (priceRange === '5k-10k') list = list.filter(p => p.price >= 5000 && p.price <= 10000)
    else if (priceRange === 'over10k') list = list.filter(p => p.price > 10000)
    return [...list].sort((a, b) => {
      if (sortBy === 'price-low')  return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating')     return b.rating - a.rating
      if (sortBy === 'new')        return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)
      return b.reviews - a.reviews
    })
  }, [products, selectedCat, sortBy, priceRange])

  const colClass = {
    2:    'grid-cols-2',
    3:    'grid-cols-2 sm:grid-cols-3',
    4:    'grid-cols-2 sm:grid-cols-4',
    5:    'grid-cols-2 sm:grid-cols-5',
    list: 'grid-cols-1',
  }[gridCols] ?? 'grid-cols-2 sm:grid-cols-4'

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            {title && <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">{title}</h2>}
            {subtitle && <p className="text-muted text-lg max-w-xl">{subtitle}</p>}
          </motion.div>
        )}

        {showFilters && (
          <div className="flex flex-col gap-4 mb-10">
            {/* Category pills — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {categories.map((cat, i) => {
                const count = cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length
                const isActive = selectedCat === cat.id
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 overflow-hidden group rounded-xl ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'bg-tertiary text-muted border border-white/[0.06] hover:text-foreground hover:border-white/20'
                    }`}
                  >
                    <CategoryIcon id={cat.id} className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-muted'
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-2">
              <Dropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} prefix="Sort:" />
              <Dropdown value={priceRange} onChange={setPriceRange} options={PRICE_OPTIONS} prefix="Price:" />
              <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-muted font-mono hidden sm:block">{filtered.length} items</span>
                <GridToggle cols={gridCols} onChange={setGridCols} />
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-28 text-muted">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth={1.4} />
              <path strokeLinecap="round" strokeWidth={1.4} d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-base font-medium">No products found</p>
            <p className="text-sm mt-1 opacity-60">Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid ${colClass} gap-4 sm:gap-5`}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
                >
                  <ProductCard product={product} listView={gridCols === 'list'} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
