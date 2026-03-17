import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'
import Breadcrumb from '../components/Breadcrumb'
import CategoryIcon from '../components/CategoryIcon'
import ScrollFloat from '../components/ScrollFloat'
import { useProducts } from '../hooks/useProducts'
import { categories } from '../data/products'

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white/[0.06] rounded-2xl mb-3" style={{ aspectRatio: '3/4' }} />
          <div className="bg-white/[0.06] rounded h-3 w-3/4 mb-2" />
          <div className="bg-white/[0.06] rounded h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export default function ShopPage() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const filterNew = searchParams.get('filter') === 'new'

  useEffect(() => { window.scrollTo(0, 0) }, [category])

  const params = {}
  if (category)  params.category   = category
  if (filterNew) params.newArrival = 'true'

  const { products, loading } = useProducts(params)

  const catInfo  = categories.find(c => c.id === category)
  const title    = filterNew ? 'New Arrivals' : catInfo ? catInfo.label : 'All Products'
  const subtitle = filterNew
    ? 'Fresh styles, just dropped'
    : catInfo
    ? `${products.length} premium pieces in ${catInfo.label}`
    : 'Browse our complete premium collection'

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    ...(catInfo ? [{ label: catInfo.label }] : []),
    ...(filterNew ? [{ label: 'New Arrivals' }] : []),
  ]

  return (
    <div className="pt-[68px] min-h-screen">
      <div className="border-b border-white/[0.06] py-10 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(180deg, #141414 0%, #0f0f0f 100%)', boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset' }}>
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <div className="flex items-end gap-4 mt-6">
            {catInfo && (
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <CategoryIcon id={catInfo.id} className="w-5 h-5 text-accent" />
              </div>
            )}
            <div>
              <ScrollFloat>
                <h1 className="font-display text-4xl sm:text-5xl font-bold">{title}</h1>
              </ScrollFloat>
              <p className="text-muted mt-2 text-sm">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? <ProductGridSkeleton /> : products.length === 0 ? (
          <div className="text-center py-24"><p className="text-muted text-lg">No products found</p></div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProductGrid products={products} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
