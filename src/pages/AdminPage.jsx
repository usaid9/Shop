import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAllOrders, updateOrderStatus } from '../api/client'

// ── Constants ──────────────────────────────────────────────────────────────
const STATUSES = ['pending', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled']
const STATUS_META = {
  pending:          { color: 'text-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/20',  dot: 'bg-yellow-400',  label: 'Pending' },
  processing:       { color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-400/20',      dot: 'bg-blue-400',    label: 'Processing' },
  shipped:          { color: 'text-purple-400',  bg: 'bg-purple-400/10 border-purple-400/20',  dot: 'bg-purple-400',  label: 'Shipped' },
  'out-for-delivery': { color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20', dot: 'bg-orange-400',  label: 'Out for Delivery' },
  delivered:        { color: 'text-green-400',   bg: 'bg-green-400/10 border-green-400/20',    dot: 'bg-green-400',   label: 'Delivered' },
  cancelled:        { color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/20',        dot: 'bg-red-400',     label: 'Cancelled' },
}
const PM_LABELS = { jazzcash: 'JazzCash', easypaisa: 'EasyPaisa', cod: 'COD', bank: 'Bank Transfer' }
const ADMIN_PASS = 'premium2025'

// ── Skeleton Components ────────────────────────────────────────────────────
function SkeletonPulse({ className = '' }) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
}

function StatCardSkeleton() {
  return (
    <div className="panel-inset border border-white/[0.06] rounded-2xl p-5">
      <SkeletonPulse className="h-3 w-20 mb-4" />
      <SkeletonPulse className="h-8 w-28 mb-2" />
      <SkeletonPulse className="h-3 w-16" />
    </div>
  )
}

function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.04]">
      <SkeletonPulse className="h-3 w-24" />
      <SkeletonPulse className="h-3 flex-1" />
      <SkeletonPulse className="h-3 w-20 hidden sm:block" />
      <SkeletonPulse className="h-6 w-20 rounded-full" />
      <SkeletonPulse className="h-3 w-16 hidden md:block" />
      <SkeletonPulse className="h-7 w-24 rounded-lg hidden lg:block" />
    </div>
  )
}

// ── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${m.bg} ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

// ── Order Detail Modal ─────────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(order.status)
  const [note, setNote]     = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const handleUpdate = async () => {
    if (status === order.status && !note) return
    setSaving(true)
    try {
      await onStatusUpdate(order._id, status, note)
      setSaved(true)
      setTimeout(() => { setSaved(false); onClose() }, 900)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-secondary w-full sm:max-w-xl border-t sm:border border-white/[0.06] sm:rounded-2xl rounded-t-2xl overflow-y-auto"
        style={{ maxHeight: '90dvh' }}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-secondary/95 backdrop-blur border-b border-white/[0.06] px-5 py-4 flex justify-between items-center z-10"
          style={{ background: 'linear-gradient(180deg,rgba(20,20,20,0.98) 0%,rgba(16,16,16,0.95) 100%)' }}>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Order Details</p>
            <p className="font-mono text-accent font-bold text-lg">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground rounded-lg hover:bg-white/[0.05] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Customer */}
          <div className="panel-inset border border-white/[0.05] rounded-xl p-4">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Customer</p>
            <p className="font-semibold text-foreground/90">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-muted mt-1">{order.shippingAddress?.phone}</p>
            {order.shippingAddress?.email && <p className="text-sm text-muted">{order.shippingAddress.email}</p>}
            <p className="text-sm text-muted mt-1">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
          </div>

          {/* Items */}
          <div className="panel-inset border border-white/[0.05] rounded-xl p-4">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Items ({order.items?.length})</p>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/[0.06] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted">{item.selectedColor} · {item.selectedSize} · ×{item.quantity}</p>
                  </div>
                  <p className="text-sm text-accent font-bold shrink-0">Rs {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between">
              <span className="text-sm text-muted">Total</span>
              <span className="font-bold text-accent">Rs {order.total?.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment + Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="panel-inset border border-white/[0.05] rounded-xl p-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Payment</p>
              <p className="text-sm font-semibold">{PM_LABELS[order.paymentMethod] || order.paymentMethod}</p>
            </div>
            <div className="panel-inset border border-white/[0.05] rounded-xl p-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Placed</p>
              <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Update Status */}
          <div className="panel-inset border border-white/[0.05] rounded-xl p-4">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Update Status</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all border ${
                    status === s
                      ? `${STATUS_META[s]?.bg} ${STATUS_META[s]?.color} border-current`
                      : 'border-white/[0.06] text-muted hover:border-white/20 hover:text-foreground'
                  }`}>
                  {STATUS_META[s]?.label}
                </button>
              ))}
            </div>
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Note (optional)..."
              className="w-full px-3 py-2.5 bg-primary/80 border border-white/[0.07] rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors mb-3"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleUpdate}
              disabled={saving || saved}
              className={`w-full py-3 text-sm font-bold rounded-xl transition-all ${
                saved
                  ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                  : 'bg-accent text-white hover:bg-accent/90 accent-glow'
              } disabled:opacity-60`}
            >
              {saved ? '✓ Updated!' : saving ? 'Saving…' : 'Save Changes'}
            </motion.button>
          </div>

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <div className="panel-inset border border-white/[0.05] rounded-xl p-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-3">History</p>
              <div className="space-y-2">
                {[...order.statusHistory].reverse().slice(0, 5).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className={`w-2 h-2 rounded-full mt-0.5 shrink-0 ${STATUS_META[h.status]?.dot || 'bg-muted'}`} />
                    <div>
                      <span className="font-semibold capitalize">{h.status?.replace(/-/g, ' ')}</span>
                      {h.note && <span className="text-muted"> — {h.note}</span>}
                      <p className="text-muted/60 mt-0.5">{new Date(h.timestamp || h.date).toLocaleString('en-PK')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'text-foreground', icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel-inset border border-white/[0.06] rounded-2xl p-5 card-depth"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] text-muted uppercase tracking-widest">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-muted">
          {icon}
        </div>
      </div>
      <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </motion.div>
  )
}

// ── Main Admin Page ────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed]       = useState(() => sessionStorage.getItem('admin_auth') === '1')
  const [passInput, setPassInput] = useState('')
  const [passErr, setPassErr]     = useState(false)

  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected]   = useState(null)
  const [search, setSearch]       = useState('')

  const limit = 15

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (statusFilter) params.status = statusFilter
      const { data } = await fetchAllOrders(params)
      setOrders(data.orders || [])
      setTotal(data.total || 0)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, limit])

  useEffect(() => { if (authed) loadOrders() }, [authed, loadOrders])

  const handleLogin = (e) => {
    e.preventDefault()
    if (passInput === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', '1')
      setAuthed(true)
    } else {
      setPassErr(true)
      setTimeout(() => setPassErr(false), 1500)
    }
  }

  const handleStatusUpdate = async (id, status, note) => {
    await updateOrderStatus(id, status, note)
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    if (selected?._id === id) setSelected(prev => ({ ...prev, status }))
  }

  // Derived stats
  const stats = {
    total:     total,
    revenue:   orders.reduce((s, o) => s + (o.total || 0), 0),
    pending:   orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  const filtered = search.trim()
    ? orders.filter(o =>
        o._id?.includes(search) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        o.shippingAddress?.phone?.includes(search)
      )
    : orders

  // ── Login Gate ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="pt-[68px] min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="panel-inset border border-white/[0.06] rounded-2xl p-8 card-depth">
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-center mb-1">Admin Access</h1>
          <p className="text-muted text-sm text-center mb-6">Enter your password to continue</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <motion.div animate={passErr ? { x: [-6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.3 }}>
              <input
                type="password"
                value={passInput}
                onChange={e => setPassInput(e.target.value)}
                placeholder="Password"
                autoFocus
                className={`w-full px-4 py-3 bg-primary/80 border rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none transition-colors ${
                  passErr ? 'border-red-500/60 focus:border-red-500' : 'border-white/[0.07] focus:border-accent'
                }`}
              />
              {passErr && <p className="text-red-400 text-xs mt-1.5 px-1">Incorrect password</p>}
            </motion.div>
            <button type="submit" className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors accent-glow text-sm">
              Enter Dashboard
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="pt-[68px] min-h-screen">
      {/* Page Header */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-8"
        style={{ background: 'linear-gradient(180deg,#141414 0%,#0f0f0f 100%)', boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Dashboard
            </p>
            <h1 className="font-display text-4xl font-bold">Admin <span className="text-accent italic">Panel</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadOrders} disabled={loading}
              className="p-2.5 border border-white/[0.08] rounded-xl text-muted hover:text-foreground hover:border-white/20 transition-colors disabled:opacity-40">
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }}
              className="px-4 py-2 border border-white/[0.08] rounded-xl text-xs text-muted hover:text-foreground hover:border-white/20 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Total Orders" value={stats.total.toLocaleString()} color="text-foreground"
                sub="all time"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              />
              <StatCard label="Revenue (page)" value={`Rs ${stats.revenue.toLocaleString()}`} color="text-accent"
                sub={`${orders.length} orders shown`}
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard label="Pending" value={stats.pending} color="text-yellow-400"
                sub="need action"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="M12 6v6l4 2" /></svg>}
              />
              <StatCard label="Delivered" value={stats.delivered} color="text-green-400"
                sub="completed"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>}
              />
            </>
          )}
        </div>

        {/* Orders Table */}
        <div className="panel-inset border border-white/[0.06] rounded-2xl card-depth overflow-hidden">

          {/* Table Toolbar */}
          <div className="px-5 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID, name or phone..."
                className="w-full pl-9 pr-4 py-2.5 bg-primary/60 border border-white/[0.07] rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['', ...STATUSES].map(s => (
                <button key={s || 'all'}
                  onClick={() => { setStatusFilter(s); setPage(1) }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    statusFilter === s
                      ? s ? `${STATUS_META[s]?.bg} ${STATUS_META[s]?.color}` : 'bg-accent/20 text-accent border-accent/30'
                      : 'border-white/[0.06] text-muted hover:border-white/20 hover:text-foreground'
                  }`}>
                  {s ? STATUS_META[s]?.label : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Table Head */}
          <div className="hidden md:grid grid-cols-[140px_1fr_100px_130px_90px_90px] gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] uppercase tracking-widest text-muted">
            <span>Order ID</span><span>Customer</span><span>Items</span><span>Status</span><span>Total</span><span>Action</span>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {Array.from({ length: limit }).map((_, i) => <OrderRowSkeleton key={i} />)}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-muted text-sm">No orders found</p>
              </motion.div>
            ) : (
              <motion.div key="rows" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {filtered.map((order, i) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid md:grid-cols-[140px_1fr_100px_130px_90px_90px] gap-4 items-center px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => setSelected(order)}
                  >
                    {/* ID */}
                    <div>
                      <p className="font-mono text-xs text-accent font-bold">#{order._id?.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    {/* Customer */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{order.shippingAddress?.fullName || '—'}</p>
                      <p className="text-xs text-muted truncate">{order.shippingAddress?.phone} · {order.shippingAddress?.city}</p>
                    </div>
                    {/* Items */}
                    <p className="text-sm text-muted hidden md:block">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                    {/* Status */}
                    <div className="hidden md:block"><StatusBadge status={order.status} /></div>
                    {/* Total */}
                    <p className="text-sm font-bold text-foreground/90 hidden md:block">Rs {order.total?.toLocaleString()}</p>
                    {/* Action */}
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(order) }}
                      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-muted hover:border-accent/40 hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                    >
                      View
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {/* Mobile info */}
                    <div className="md:hidden col-span-full flex items-center justify-between mt-1">
                      <StatusBadge status={order.status} />
                      <p className="text-sm font-bold text-accent">Rs {order.total?.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-xs text-muted">{total} orders · page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 border border-white/[0.08] rounded-lg text-xs text-muted hover:text-foreground hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = page <= 3 ? i + 1 : page + i - 2
                  if (p < 1 || p > totalPages) return null
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        p === page ? 'bg-accent text-white' : 'border border-white/[0.08] text-muted hover:text-foreground hover:border-white/20'
                      }`}>
                      {p}
                    </button>
                  )
                })}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 border border-white/[0.08] rounded-lg text-xs text-muted hover:text-foreground hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {selected && (
          <OrderModal
            key={selected._id}
            order={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
