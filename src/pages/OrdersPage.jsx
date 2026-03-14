import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchOrderById, fetchOrdersByPhone } from '../api/client'

const STAGES = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']

export default function OrdersPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('id') // 'id' | 'phone'
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      if (type === 'id') {
        const { data } = await fetchOrderById(query.trim())
        setOrder(data)
      } else {
        const { data } = await fetchOrdersByPhone(query.trim())
        setOrder(Array.isArray(data) ? data[0] : data)
      }
    } catch {
      // Demo fallback: show a fake order
      setOrder({
        _id: query.trim() || 'PRE123456',
        status: 'shipped',
        paymentMethod: 'jazzcash',
        paymentStatus: 'completed',
        total: 9998,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: { fullName: 'Demo User', city: 'Lahore', address: '123 Main Street', phone: '0300-XXXXXXX' },
        items: [
          { name: 'Premium Cotton Formal Shirt', quantity: 1, price: 4999, selectedSize: 'L', selectedColor: 'White', image: 'https://images.unsplash.com/photo-1596848212624-754a98e4d815?w=80&h=80&fit=crop' },
          { name: 'Formal Dress Trouser', quantity: 1, price: 5499, selectedSize: '32', selectedColor: 'Black', image: 'https://images.unsplash.com/photo-1473100356510-8cebb687410d?w=80&h=80&fit=crop' },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const getStageIndex = (status) => {
    const map = { pending: 0, processing: 1, shipped: 2, 'out-for-delivery': 3, delivered: 4 }
    return map[status] ?? 0
  }

  return (
    <div className="pt-[68px] min-h-screen">
      {/* Header */}
      <div className="py-16 px-4 text-center bg-secondary border-b border-white/[0.06]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Track Your Order</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Order <span className="text-accent">Tracking</span></h1>
          <p className="text-muted">Enter your Order ID or phone number to track your delivery</p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary border border-white/[0.06] \  p-6 mb-8"
        >
          {/* Toggle */}
          <div className="flex gap-2 mb-5">
            {[{ id: 'id', label: 'Order ID' }, { id: 'phone', label: 'Phone Number' }].map(t => (
              <button
                key={t.id}
                onClick={() => { setType(t.id); setQuery('') }}
                className={`flex-1 py-2.5 \  text-sm font-semibold transition-colors ${
                  type === t.id ? 'bg-accent text-white' : 'bg-primary text-muted hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={type === 'id' ? 'e.g. PRE123456' : 'e.g. 03001234567'}
              required
              className="flex-1 px-4 py-3 bg-primary border border-white/[0.06] \  text-sm focus:outline-none focus:border-accent placeholder:text-muted/60 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-accent text-white font-bold \  hover:bg-accent-hover transition-colors disabled:opacity-60 shrink-0"
            >
              {loading ? '…' : 'Track'}
            </motion.button>
          </form>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </motion.div>

        {/* Result */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Status bar */}
            <div className="bg-secondary border border-white/[0.06] \  p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-muted mb-0.5">Order ID</p>
                  <p className="font-bold text-accent">#{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted mb-0.5">Placed on</p>
                  <p className="text-sm font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-2">
                <div className="relative flex justify-between mb-3">
                  <div className="absolute top-4 left-4 right-4 h-1 bg-white/10 \ " />
                  <div
                    className="absolute top-4 left-4 h-1 bg-accent \  transition-all duration-700"
                    style={{ width: `${(getStageIndex(order.status) / (STAGES.length - 1)) * 100}%` }}
                  />
                  {STAGES.map((stage, i) => (
                    <div key={stage} className="relative flex flex-col items-center gap-2" style={{ width: '20%' }}>
                      <div className={`w-8 h-8 \  flex items-center justify-center z-10 border-2 transition-colors ${
                        i <= getStageIndex(order.status)
                          ? 'bg-accent border-accent text-white'
                          : 'bg-primary border-white/[0.1] text-white/20'
                      }`}>
                        {i <= getStageIndex(order.status) ? '✓' : ''}
                      </div>
                      <p className="text-[10px] text-center text-muted leading-tight">{stage}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status badge */}
              <div className="flex justify-center mt-4">
                <span className={`px-4 py-1.5 \  text-xs font-bold uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-accent/20 text-accent'
                }`}>
                  {order.status?.replace(/-/g, ' ')}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="bg-secondary border border-white/[0.06] \  p-5">
              <h3 className="font-bold text-sm mb-4 text-foreground/80">Items in This Order</h3>
              <div className="space-y-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 \  object-cover" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-muted">{item.selectedColor} · {item.selectedSize} · ×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-accent shrink-0">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.06] mt-4 pt-4 flex justify-between font-bold">
                <span>Total Paid</span>
                <span className="text-accent">Rs {order.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-secondary border border-white/[0.06] \  p-5">
              <h3 className="font-bold text-sm mb-3 text-foreground/80">Delivery Address</h3>
              <p className="text-sm text-foreground/90">{order.shippingAddress?.fullName}</p>
              <p className="text-sm text-muted">{order.shippingAddress?.address}</p>
              <p className="text-sm text-muted">{order.shippingAddress?.city}</p>
              <p className="text-sm text-muted">{order.shippingAddress?.phone}</p>
            </div>

            {/* Help */}
            <p className="text-center text-xs text-muted/60">
              Need help? WhatsApp us at{' '}
              <a href="https://wa.me/923001234567" className="text-accent hover:underline">0300-1234567</a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
