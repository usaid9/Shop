import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'
import { GhostGrid } from '../components/GhostCard'
import Breadcrumb from '../components/Breadcrumb'
import CategoryIcon from '../components/CategoryIcon'
import ScrollFloat from '../components/ScrollFloat'
import { useProducts } from '../hooks/useProducts'
import { categories } from '../data/products'

export default function ShopPage() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const filterNew = searchParams.get('filter') === 'new'

  useEffect(() => { window.scrollTo(0, 0) }, [category])

  const params = {}
  if (category)  params.category   = category
  if (filterNew) params.newArrival = 'true'

  const { products, loading } = useProducts(params)

  // Dynamically generate categories from products
  const dynamicCategories = [
    { id: 'all', label: 'All Products', count: products.length },
    ...Array.from(
      products.reduce((set, p) => {
        if (p.category) set.add(p.category)
        return set
      }, new Set()),
      cat => ({
        id: cat,
        label: cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: products.filter(p => p.category === cat).length
      })
    )
  ]

  const catInfo = dynamicCategories.find(c => c.id === category)
  const title = filterNew ? 'New Arrivals' : catInfo ? catInfo.label : 'All Products'
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
      <div className="py-10 px-4 sm:px-6 lg:px-8" style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-cart)", boxShadow: "inset 0 1px 0 var(--inset-highlight)" }}>
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
        {products.length === 0 && !loading ? (
          <div className="text-center py-24"><p className="text-muted text-lg">No products found</p></div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProductGrid products={products} loading={loading} categories={dynamicCategories} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
