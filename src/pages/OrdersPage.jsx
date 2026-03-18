import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/Breadcrumb'
import { fetchOrderById, fetchOrdersByPhone } from '../api/client'

const STAGES = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']

export default function OrdersPage() {
  const [query, setQuery]     = useState('')
  const [type, setType]       = useState('id')
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true); setError(''); setOrders([]); setNotFound(false)
    try {
      if (type === 'id') {
        const { data } = await fetchOrderById(query.trim())
        if (data && data._id) {
          setOrders([data])
        } else {
          setNotFound(true)
        }
      } else {
        const { data } = await fetchOrdersByPhone(query.trim())
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data)
        } else if (data && data._id) {
          setOrders([data])
        } else {
          setNotFound(true)
        }
      }
    } catch {
      setNotFound(true)
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
      {/* Page header */}
        <div style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-cart)", boxShadow: "inset 0 1px 0 var(--inset-highlight)" }}>
        <div className="max-w-2xl mx-auto">
          <Breadcrumb />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-4">
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Delivery Status
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Order <span className="text-accent italic">Tracking</span>
            </h1>
            <p className="text-muted mt-3 text-sm">Enter your Order ID or phone number to track your delivery</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="panel-inset border-themed rounded-2xl p-6 mb-8 card-depth"
        >
          {/* Toggle tabs */}
          <div className="flex gap-2 mb-5">
            {[{ id: 'id', label: 'Order ID' }, { id: 'phone', label: 'Phone Number' }].map(t => (
              <button
                key={t.id}
                onClick={() => { setType(t.id); setQuery(''); setOrder(null); setNotFound(false) }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all rounded-xl ${
                  type === t.id ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
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
              className="flex-1 px-4 py-3 bg-primary/80 border-themed rounded-xl text-sm text-foreground focus:outline-none focus:border-accent placeholder:text-muted/60 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60 shrink-0 accent-glow"
            >
              {loading ? '…' : 'Track'}
            </motion.button>
          </form>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </motion.div>

        {/* Not found */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel-inset border-themed rounded-2xl p-8 text-center card-depth"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "var(--inset-highlight)", border: "1px solid var(--border-default)" }}>
              <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" strokeWidth={1.5} />
                <path strokeLinecap="round" strokeWidth={1.5} d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground/90 mb-1">Order Not Found</h3>
            <p className="text-sm text-muted mb-2">
              No order matching <span className="text-foreground/70 font-mono">"{query}"</span> was found.
            </p>
            <p className="text-xs text-muted/60">Check your Order ID from your confirmation, or try your phone number.</p>
            <p className="text-xs text-muted/50 mt-3">
              Need help?{' '}
              <a href="https://wa.me/923001234567" className="text-accent hover:underline">WhatsApp us</a>
            </p>
          </motion.div>
        )}

        {/* Results */}
        {orders.length > 0 && orders.map((order, idx) => (
          <motion.div
            key={order._id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-8"
          >
            {/* Progress tracker */}
            <div className="panel-inset border-themed rounded-2xl p-6 card-depth">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Order ID</p>
                  <p className="font-bold text-accent font-mono">#PRE{order._id?.slice(-6)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Placed on</p>
                  <p className="text-sm font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Step indicators */}
              <div className="relative">
                {/* Background track */}
                <div className="absolute top-4 left-4 right-4 h-0.5 rounded-full" style={{ background: "var(--border-default)" }} />
                {/* Progress fill */}
                <div
                  className="absolute top-4 left-4 h-0.5 bg-accent rounded-full transition-all duration-700"
                  style={{ width: `calc(${(getStageIndex(order.status) / (STAGES.length - 1)) * 100}% - 2rem)` }}
                />
                <div className="relative flex justify-between">
                  {STAGES.map((stage, i) => {
                    const done = i <= getStageIndex(order.status)
                    return (
                      <div key={stage} className="flex flex-col items-center gap-2" style={{ width: '20%' }}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300 text-xs font-bold ${
                            done ? 'bg-accent border-accent text-white shadow-[0_0_12px_rgba(200,16,46,0.4)]' : 'text-muted'
                          }`}
                          style={!done ? { borderColor: 'var(--border-default)', background: 'var(--color-primary)' } : {}}
                        >
                          {done ? '✓' : ''}
                        </div>
                        <p className="text-[9px] text-center text-muted leading-tight">{stage}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status badge */}
              <div className="flex justify-center mt-5">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'delivered'      ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                  order.status === 'shipped'        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                  order.status === 'out-for-delivery' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                  'bg-accent/20 text-accent border border-accent/20'
                }`}>
                  {order.status?.replace(/-/g, ' ')}
                </span>
              </div>
            </div>

            {/* Order items */}
            <div className="panel-inset border-themed rounded-2xl p-5 card-depth">
              <h3 className="font-bold text-sm mb-4 text-foreground/90">Items in This Order</h3>
              <div className="space-y-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    {item.image && (
                      <img src={item.image} alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border-themed flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-muted mt-0.5">{item.selectedColor} · {item.selectedSize} · ×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-accent shrink-0">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-themed mt-4 pt-4 flex justify-between font-bold">
                <span className="text-foreground/80">Total Paid</span>
                <span className="text-accent" style={{ textShadow: '0 0 12px rgba(200,16,46,0.4)' }}>
                  Rs {order.total?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="panel-inset border-themed rounded-2xl p-5 card-depth">
              <h3 className="font-bold text-sm mb-3 text-foreground/90">Delivery Address</h3>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/90">{order.shippingAddress?.fullName}</p>
                <p className="text-sm text-muted">{order.shippingAddress?.address}</p>
                <p className="text-sm text-muted">{order.shippingAddress?.city}</p>
                <p className="text-sm text-muted">{order.shippingAddress?.phone}</p>
              </div>
            </div>

            <p className="text-center text-xs text-muted/60 pb-4">
              Need help? WhatsApp us at{' '}
              <a href="https://wa.me/923001234567" className="text-accent hover:underline">0300-1234567</a>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
    
  )
}
