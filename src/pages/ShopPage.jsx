import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'
import Breadcrumb from '../components/Breadcrumb'
import CategoryIcon from '../components/CategoryIcon'
import ScrollFloat from '../components/ScrollFloat'
import { products, categories } from '../data/products'

export default function ShopPage() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const filterNew = searchParams.get('filter') === 'new'

  useEffect(() => { window.scrollTo(0, 0) }, [category])

  let list = products
  if (category) list = products.filter(p => p.category === category)
  if (filterNew) list = products.filter(p => p.newArrival)

  const catInfo  = categories.find(c => c.id === category)
  const title    = filterNew ? 'New Arrivals' : catInfo ? catInfo.label : 'All Products'
  const subtitle = filterNew
    ? 'Fresh styles, just dropped'
    : catInfo
    ? `${list.length} premium pieces in ${catInfo.label}`
    : 'Browse our complete premium collection'

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    ...(catInfo ? [{ label: catInfo.label }] : []),
    ...(filterNew ? [{ label: 'New Arrivals' }] : []),
  ]

  return (
    <div className="pt-[68px] min-h-screen">
      {/* Page header */}
      <div className="border-b border-white/[0.06] py-10 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(180deg, #141414 0%, #0f0f0f 100%)', boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-4"><Breadcrumb custom={breadcrumbs} /></div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-start gap-4 mt-3"
          >
            {catInfo && (
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-white/[0.08] text-accent rounded-xl">
                <CategoryIcon id={catInfo.id} className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                <ScrollFloat scrollOffset={['start 95%', 'start 60%']}>{title}</ScrollFloat>
              </h1>
              <p className="text-muted mt-2 text-sm">{subtitle}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <ProductGrid products={list} showFilters={!category && !filterNew} />
    </div>
  )
}
