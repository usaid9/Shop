import React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAllOrders, updateOrderStatus, fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/client'
import api from '../api/client'

const STATUSES = ['pending','processing','shipped','out-for-delivery','delivered','cancelled']
const STATUS_META = {
  pending:            { color:'text-yellow-400', bg:'bg-yellow-400/10 border-yellow-400/20', dot:'bg-yellow-400',  label:'Pending' },
  processing:         { color:'text-blue-400',   bg:'bg-blue-400/10 border-blue-400/20',     dot:'bg-blue-400',    label:'Processing' },
  shipped:            { color:'text-purple-400', bg:'bg-purple-400/10 border-purple-400/20', dot:'bg-purple-400',  label:'Shipped' },
  'out-for-delivery': { color:'text-orange-400', bg:'bg-orange-400/10 border-orange-400/20', dot:'bg-orange-400',  label:'Out for Delivery' },
  delivered:          { color:'text-green-400',  bg:'bg-green-400/10 border-green-400/20',   dot:'bg-green-400',   label:'Delivered' },
  cancelled:          { color:'text-red-400',    bg:'bg-red-400/10 border-red-400/20',       dot:'bg-red-400',     label:'Cancelled' },
}
const PM_LABELS    = { jazzcash:'JazzCash', easypaisa:'EasyPaisa', cod:'COD', bank:'Bank Transfer' }
const ADMIN_PASS   = 'premium2025'
const CATEGORIES   = ['shirts','trousers','kameez-shalwar','waistcoats','kurtas','accessories']

// ── Helpers ────────────────────────────────────────────────────────────────
function SkeletonPulse({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ background: 'var(--ghost-base)' }}
    >
      <span
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--ghost-shine) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'ghost-sweep 1.6s ease-in-out infinite',
        }}
      />
    </div>
  )
}
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${m.bg} ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />{m.label}
    </span>
  )
}

// ── Order Modal ────────────────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusUpdate }) {
  const [status,setStatus] = useState(order.status)
  const [note,setNote]     = useState('')
  const [saving,setSaving] = useState(false)
  const [saved,setSaved]   = useState(false)

  const handleUpdate = async () => {
    if (status === order.status && !note) return
    setSaving(true)
    try { await onStatusUpdate(order._id, status, note); setSaved(true); setTimeout(() => { setSaved(false); onClose() }, 900) }
    finally { setSaving(false) }
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} exit={{y:40,opacity:0}}
        transition={{duration:0.3,ease:[0.22,1,0.36,1]}}
        className="bg-secondary w-full sm:max-w-xl border-t sm:border-themed sm:rounded-2xl rounded-t-2xl overflow-y-auto"
        style={{maxHeight:'90dvh'}}>
        <div className="sticky top-0 bg-secondary/95 backdrop-blur border-b border-themed px-5 py-4 flex justify-between items-center z-10"
          style={{background:'linear-gradient(180deg,rgba(20,20,20,0.98) 0%,rgba(16,16,16,0.95) 100%)'}}>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Order Details</p>
            <p className="font-mono text-accent font-bold text-lg">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground rounded-lg hover:bg-accent/5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="panel-inset border-subtle-themed rounded-xl p-4">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Customer</p>
            <p className="font-semibold">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-muted mt-1">{order.shippingAddress?.phone}</p>
            {order.shippingAddress?.email && <p className="text-sm text-muted">{order.shippingAddress.email}</p>}
            <p className="text-sm text-muted mt-1">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
          </div>
          <div className="panel-inset border-subtle-themed rounded-xl p-4">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Items ({order.items?.length})</p>
            <div className="space-y-3">
              {order.items?.map((item,i) => (
                <div key={i} className="flex gap-3 items-center">
                  {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border-themed shrink-0"/>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted">{item.selectedColor} · {item.selectedSize} · ×{item.quantity}</p>
                  </div>
                  <p className="text-sm text-accent font-bold shrink-0">Rs {(item.price*item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-themed flex justify-between">
              <span className="text-sm text-muted">Total</span>
              <span className="font-bold text-accent">Rs {order.total?.toLocaleString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="panel-inset border-subtle-themed rounded-xl p-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Payment</p>
              <p className="text-sm font-semibold">{PM_LABELS[order.paymentMethod]||order.paymentMethod}</p>
            </div>
            <div className="panel-inset border-subtle-themed rounded-xl p-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Placed</p>
              <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}</p>
            </div>
          </div>
          <div className="panel-inset border-subtle-themed rounded-xl p-4">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Update Status</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all border ${status===s ? `${STATUS_META[s]?.bg} ${STATUS_META[s]?.color} border-current` : 'border-themed text-muted hover:text-foreground'}`}>
                  {STATUS_META[s]?.label}
                </button>
              ))}
            </div>
            <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Note (optional)..."
              className="w-full px-3 py-2.5 bg-primary/80 border-themed rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors mb-3"/>
            <motion.button whileTap={{scale:0.97}} onClick={handleUpdate} disabled={saving||saved}
              className={`w-full py-3 text-sm font-bold rounded-xl transition-all ${saved?'bg-green-500/20 text-green-400 border border-green-500/20':'bg-accent text-white hover:bg-accent/90 accent-glow'} disabled:opacity-60`}>
              {saved ? '✓ Updated!' : saving ? 'Saving…' : 'Save Changes'}
            </motion.button>
          </div>
          {order.statusHistory?.length > 0 && (
            <div className="panel-inset border-subtle-themed rounded-xl p-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-3">History</p>
              <div className="space-y-2">
                {[...order.statusHistory].reverse().slice(0,5).map((h,i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className={`w-2 h-2 rounded-full mt-0.5 shrink-0 ${STATUS_META[h.status]?.dot||'bg-muted'}`}/>
                    <div>
                      <span className="font-semibold capitalize">{h.status?.replace(/-/g,' ')}</span>
                      {h.note && <span className="text-muted"> — {h.note}</span>}
                      <p className="text-muted/60 mt-0.5">{new Date(h.timestamp||h.date).toLocaleString('en-PK')}</p>
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
function StatCard({ label, value, sub, color='text-foreground', icon }) {
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="panel-inset border-themed rounded-2xl p-5 card-depth">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] text-muted uppercase tracking-widest">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-muted" style={{ background: "var(--inset-highlight)", border: "1px solid var(--border-default)" }}>{icon}</div>
      </div>
      <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </motion.div>
  )
}

// ── Image Upload Zone (instant upload) ────────────────────────────────────
function ImageUploadZone({ onUploaded, currentImage }) {
  const [state, setState]       = useState('idle')   // idle | uploading | done | error
  const [progress, setProgress] = useState(0)
  const [preview, setPreview]   = useState(currentImage || null)
  const fileRef = useRef()

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    setState('uploading')
    setProgress(0)

    const fd = new FormData()
    fd.append('image', file)

    try {
      // Simulate progress while uploading
      const interval = setInterval(() => setProgress(p => Math.min(p + 8, 85)), 200)
      const { data } = await api.post('/products/upload-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      clearInterval(interval)
      setProgress(100)
      setState('done')
      onUploaded({ url: data.url, publicId: data.publicId })
    } catch (err) {
      setState('error')
      setPreview(currentImage || null)
    }
  }

  const handleFiles = (files) => {
    const file = files[0]
    if (file) uploadFile(file)
  }

  return (
    <div>
      <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Product Image</p>
      <div
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        onDragOver={e => e.preventDefault()}
        onClick={() => state !== 'uploading' && fileRef.current?.click()}
        className={`relative w-full rounded-xl border-2 border-dashed transition-colors overflow-hidden cursor-pointer ${
          state === 'uploading' ? 'border-accent/40 cursor-wait'
          : state === 'done'    ? 'border-green-500/40'
          : state === 'error'   ? 'border-red-500/40'
          : 'border-white/[0.12] hover:border-accent/40'
        }`}
        style={{ aspectRatio: '3/2' }}>
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover"/>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p className="text-sm">Click or drag & drop</p>
            <p className="text-xs text-muted/50">JPG, PNG, WEBP — max 10MB</p>
          </div>
        )}

        {/* Uploading overlay */}
        {state === 'uploading' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-accent rounded-full" animate={{width:`${progress}%`}} transition={{duration:0.3}}/>
            </div>
            <p className="text-xs text-white/70">Uploading to Cloudinary…</p>
          </div>
        )}

        {/* Done overlay */}
        {state === 'done' && preview && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
            <p className="text-xs text-white font-semibold">Change Image</p>
          </div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-400">Upload failed — try again</span>
          </div>
        )}

        {/* Uploaded badge */}
        {state === 'done' && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-[10px] text-green-400 font-semibold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              Uploaded
            </span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)}/>
    </div>
  )
}

// ── Product Form Modal ─────────────────────────────────────────────────────
function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = product && product !== 'add'
  const [form, setForm] = useState({
    name:          isEdit ? product.name               : '',
    category:      isEdit ? product.category           : 'shirts',
    customCategory: '',
    price:         isEdit ? String(product.price)      : '',
    originalPrice: isEdit ? String(product.originalPrice||'') : '',
    description:   isEdit ? product.description        : '',
    sizes:         isEdit ? product.sizes.join(', ')   : 'S, M, L, XL, XXL',
    colors:        isEdit ? product.colors.join(', ')  : '',
    inStock:       isEdit ? product.inStock   : true,
    featured:      isEdit ? product.featured  : false,
    newArrival:    isEdit ? product.newArrival : false,
  })
  const [uploadedImage, setUploadedImage] = useState(
    isEdit ? { url: product.image, publicId: product.imagePublicId } : null
  )
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const inp = 'w-full px-3 py-2.5 bg-primary/80 border-themed rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors'

  const handleSubmit = async () => {
    const categoryToUse = form.customCategory.trim() ? form.customCategory.trim() : form.category
    if (!form.name || !form.price || !categoryToUse) return setError('Name, price and category are required.')
    if (!uploadedImage?.url) return setError('Please upload an image first.')
    setSaving(true); setError('')
    try {
      const fd = new FormData()
      fd.append('name',          form.name)
      fd.append('category',      categoryToUse)
      fd.append('price',         form.price)
      fd.append('originalPrice', form.originalPrice)
      fd.append('description',   form.description)
      fd.append('sizes',         JSON.stringify(form.sizes.split(',').map(s=>s.trim()).filter(Boolean)))
      fd.append('colors',        JSON.stringify(form.colors.split(',').map(s=>s.trim()).filter(Boolean)))
      fd.append('inStock',       String(form.inStock))
      fd.append('featured',      String(form.featured))
      fd.append('newArrival',    String(form.newArrival))
      fd.append('imageUrl',      uploadedImage.url)
      fd.append('imagePublicId', uploadedImage.publicId || '')

      if (isEdit) {
        const { data } = await updateProduct(product._id, fd)
        onSaved(data, 'edit')
      } else {
        const { data } = await createProduct(fd)
        onSaved(data, 'add')
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} exit={{y:40,opacity:0}}
        transition={{duration:0.3,ease:[0.22,1,0.36,1]}}
        className="bg-secondary w-full sm:max-w-2xl border-t sm:border-themed sm:rounded-2xl rounded-t-2xl overflow-y-auto"
        style={{maxHeight:'92dvh'}}>

        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-themed px-5 py-4 flex justify-between items-center"
          style={{background:'linear-gradient(180deg,rgba(20,20,20,0.98) 0%,rgba(16,16,16,0.95) 100%)'}}>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Products</p>
            <p className="font-display text-lg font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground rounded-lg hover:bg-accent/5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Instant image upload */}
          <ImageUploadZone
            currentImage={isEdit ? product.image : null}
            onUploaded={(img) => setUploadedImage(img)}
          />

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Product Name *</label>
              <input className={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Premium Cotton Formal Shirt"/>
            </div>
            <div>
              <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Category *</label>
              <select className={inp+' appearance-none mb-2'} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
              </select>
              <input className={inp+' mt-1'} value={form.customCategory} onChange={e=>setForm(f=>({...f,customCategory:e.target.value}))} placeholder="Or enter custom category" />
              <p className="text-xs text-muted mt-1">You can select a category or enter a new one.</p>
            </div>
            <div>
              <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Price (Rs) *</label>
              <input className={inp} type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="4999"/>
            </div>
            <div>
              <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Original Price (Rs)</label>
              <input className={inp} type="number" value={form.originalPrice} onChange={e=>setForm(f=>({...f,originalPrice:e.target.value}))} placeholder="6499"/>
            </div>
            <div>
              <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Sizes (comma separated)</label>
              <input className={inp} value={form.sizes} onChange={e=>setForm(f=>({...f,sizes:e.target.value}))} placeholder="S, M, L, XL, XXL"/>
            </div>
            <div>
              <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Colors (comma separated)</label>
              <input className={inp} value={form.colors} onChange={e=>setForm(f=>({...f,colors:e.target.value}))} placeholder="White, Black, Navy"/>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Description</label>
              <textarea className={inp+' resize-none'} rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Product description..."/>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-3">
            {[['inStock','In Stock'],['featured','Featured'],['newArrival','New Arrival']].map(([key,label]) => (
              <button key={key} onClick={()=>setForm(f=>({...f,[key]:!f[key]}))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${form[key]?'bg-accent/20 text-accent border-accent/30':'border-themed text-muted hover:text-foreground'}`}>
                <span className={`w-2 h-2 rounded-full transition-colors ${form[key]?'bg-accent':'bg-muted/40'}`}/>{label}
              </button>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm px-1">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 border-themed rounded-xl text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <motion.button whileTap={{scale:0.97}} onClick={handleSubmit} disabled={saving}
              className="flex-1 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 accent-glow transition-all disabled:opacity-60 text-sm">
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Products Tab ───────────────────────────────────────────────────────────
function ProductsTab({ products, loading, onAdd, onEdit, onDelete, deleting }) {
  const [search,setSearch]       = useState('')
  const [catFilter,setCatFilter] = useState('')

  const filtered = products.filter(p => {
    const matchCat    = !catFilter || p.category === catFilter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setCatFilter('')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${!catFilter?'bg-accent/20 text-accent border-accent/30':'border-themed text-muted hover:text-foreground'}`}>
            All
          </button>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCatFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${catFilter===c?'bg-accent/20 text-accent border-accent/30':'border-themed text-muted hover:text-foreground'}`}>
              {c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth={1.5}/><path strokeLinecap="round" strokeWidth={1.5} d="M21 21l-4.35-4.35"/>
            </svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-primary/60 border-themed rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"/>
          </div>
          <button onClick={onAdd}
            className="px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 accent-glow transition-all text-sm flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({length:10}).map((_,i)=>(
            <div key={i} className="panel-inset border-themed rounded-2xl overflow-hidden">
              <div className="animate-pulse w-full" style={{ background: "var(--border-default)", aspectRatio: '3/4' }}/>
              <div className="p-3 space-y-2"><SkeletonPulse className="h-3 w-3/4"/><SkeletonPulse className="h-3 w-1/2"/></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel-inset border-themed rounded-2xl py-20 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "var(--inset-highlight)", border: "1px solid var(--border-default)" }}>
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
          <p className="text-muted text-sm">No products yet</p>
          <button onClick={onAdd} className="mt-3 px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl text-sm font-semibold hover:bg-accent/30 transition-colors">
            Add your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filtered.map((p,i)=>(
              <motion.div key={p._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}}
                className="panel-inset border-themed rounded-2xl overflow-hidden group card-depth">
                <div className="relative overflow-hidden" style={{ background: "var(--inset-highlight)", aspectRatio: '3/4' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {p.newArrival && <span className="px-2 py-0.5 bg-accent text-white text-[9px] font-bold uppercase tracking-wider rounded-full">New</span>}
                    {p.featured   && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-[9px] font-bold uppercase tracking-wider rounded-full">Featured</span>}
                    {!p.inStock   && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/20 text-[9px] font-bold uppercase tracking-wider rounded-full">Out of Stock</span>}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={()=>onEdit(p)}
                      className="px-3 py-1.5 rounded-lg text-xs text-foreground font-semibold transition-colors backdrop-blur-sm" style={{ background: "var(--surface-cart)", border: "1px solid var(--border-default)" }}>
                      Edit
                    </button>
                    <button onClick={()=>onDelete(p._id)} disabled={deleting===p._id}
                      className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-400 font-semibold hover:bg-red-500/30 transition-colors backdrop-blur-sm disabled:opacity-50">
                      {deleting===p._id?'…':'Delete'}
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-foreground/90 truncate">{p.name}</p>
                  <p className="text-[10px] text-muted capitalize mt-0.5">{p.category}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-sm font-bold text-accent">Rs {p.price.toLocaleString()}</span>
                    {p.originalPrice && <span className="text-[10px] text-muted line-through">Rs {p.originalPrice.toLocaleString()}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,setAuthed]     = useState(()=>sessionStorage.getItem('admin_auth')==='1')
  const [passInput,setPass]    = useState('')
  const [passErr,setPassErr]   = useState(false)
  const [activeTab,setActiveTab] = useState('orders')

  const [orders,setOrders]     = useState([])
  const [loading,setLoading]   = useState(true)
  const [total,setTotal]       = useState(0)
  const [page,setPage]         = useState(1)
  const [statusFilter,setStatusFilter] = useState('')
  const [selected,setSelected] = useState(null)
  const [search,setSearch]     = useState('')
  const limit = 15

  const [products,setProducts]       = useState([])
  const [prodLoading,setProdLoading] = useState(false)
  const [prodModal,setProdModal]     = useState(null)
  const [prodDeleting,setProdDeleting] = useState(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (statusFilter) params.status = statusFilter
      const { data } = await fetchAllOrders(params)
      setOrders(data.orders||[]); setTotal(data.total||0)
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }, [page, statusFilter])

  const loadProducts = useCallback(async () => {
    setProdLoading(true)
    try { const { data } = await fetchProducts({ limit:200 }); setProducts(data.products||[]) }
    catch { setProducts([]) }
    finally { setProdLoading(false) }
  }, [])

  useEffect(() => { if (authed) loadOrders()   }, [authed, loadOrders])
  useEffect(() => { if (authed) loadProducts() }, [authed, loadProducts])

  const handleLogin = (e) => {
    e.preventDefault()
    if (passInput === ADMIN_PASS) { sessionStorage.setItem('admin_auth','1'); setAuthed(true) }
    else { setPassErr(true); setTimeout(()=>setPassErr(false), 1500) }
  }

  const handleStatusUpdate = async (id, status, note) => {
    await updateOrderStatus(id, status, note)
    setOrders(prev => prev.map(o => o._id===id ? {...o, status} : o))
    if (selected?._id===id) setSelected(prev=>({...prev, status}))
  }

  const handleProductSaved = (saved, type) => {
    if (type==='add') setProducts(prev=>[saved,...prev])
    else setProducts(prev=>prev.map(p=>p._id===saved._id?saved:p))
  }

  const stats = {
    total, revenue: orders.reduce((s,o)=>s+(o.total||0),0),
    pending:   orders.filter(o=>o.status==='pending').length,
    delivered: orders.filter(o=>o.status==='delivered').length,
  }

  const filtered = search.trim()
    ? orders.filter(o => o._id?.includes(search) || o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) || o.shippingAddress?.phone?.includes(search))
    : orders

  if (!authed) return (
    <div className="pt-[68px] min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} className="w-full max-w-sm">
        <div className="panel-inset border-themed rounded-2xl p-8 card-depth">
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-center mb-1">Admin Access</h1>
          <p className="text-muted text-sm text-center mb-6">Enter your password to continue</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <motion.div animate={passErr?{x:[-6,6,-4,4,0]}:{}} transition={{duration:0.3}}>
              <input type="password" value={passInput} onChange={e=>setPass(e.target.value)} placeholder="Password" autoFocus
                className={`w-full px-4 py-3 bg-primary/80 border rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none transition-colors ${passErr?'border-red-500/60':'border-themed focus:border-accent'}`}/>
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

  const totalPages = Math.ceil(total/limit)

  return (
    <div className="pt-[68px] min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8"
        style={{ background: 'var(--surface-cart)', boxShadow: 'inset 0 1px 0 var(--inset-highlight)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
                <span className="w-5 h-px bg-accent"/> Dashboard
              </p>
              <h1 className="font-display text-4xl font-bold">Admin <span className="text-accent italic">Panel</span></h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={activeTab==='orders'?loadOrders:loadProducts} disabled={loading||prodLoading}
                className="p-2.5 border-themed rounded-xl text-muted hover:text-foreground transition-colors disabled:opacity-40">
                <svg className={`w-4 h-4 ${(loading||prodLoading)?'animate-spin':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
              <button onClick={()=>{sessionStorage.removeItem('admin_auth');setAuthed(false)}}
                className="px-4 py-2 border-themed rounded-xl text-xs text-muted hover:text-foreground transition-colors">
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex gap-1 mt-6">
            {[{id:'orders',label:'Orders'},{id:'products',label:'Products'}].map(tab=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${activeTab===tab.id?'bg-accent/20 text-accent border-accent/30':'border-transparent text-muted hover:text-foreground'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {activeTab==='orders' && (<>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? Array.from({length:4}).map((_,i)=>(
              <div key={i} className="panel-inset border-themed rounded-2xl p-5">
                <SkeletonPulse className="h-3 w-20 mb-4"/><SkeletonPulse className="h-8 w-28 mb-2"/><SkeletonPulse className="h-3 w-16"/>
              </div>
            )) : (<>
              <StatCard label="Total Orders" value={stats.total.toLocaleString()} sub="all time"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}/>
              <StatCard label="Revenue (page)" value={`Rs ${stats.revenue.toLocaleString()}`} color="text-accent" sub={`${orders.length} orders shown`}
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}/>
              <StatCard label="Pending" value={stats.pending} color="text-yellow-400" sub="need action"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.5}/><path strokeLinecap="round" strokeWidth={1.5} d="M12 6v6l4 2"/></svg>}/>
              <StatCard label="Delivered" value={stats.delivered} color="text-green-400" sub="completed"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/></svg>}/>
            </>)}
          </div>

          <div className="panel-inset border-themed rounded-2xl card-depth overflow-hidden">
            <div className="px-5 py-4 border-b border-themed flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" strokeWidth={1.5}/><path strokeLinecap="round" strokeWidth={1.5} d="M21 21l-4.35-4.35"/>
                </svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ID, name or phone..."
                  className="w-full pl-9 pr-4 py-2.5 bg-primary/60 border-themed rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"/>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['',...STATUSES].map(s=>(
                  <button key={s||'all'} onClick={()=>{setStatusFilter(s);setPage(1)}}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${statusFilter===s ? (s?`${STATUS_META[s]?.bg} ${STATUS_META[s]?.color}`:'bg-accent/20 text-accent border-accent/30') : 'border-themed text-muted hover:text-foreground'}`}>
                    {s?STATUS_META[s]?.label:'All'}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-[140px_1fr_100px_130px_90px_90px] gap-4 px-5 py-3 border-b text-[10px] uppercase tracking-widest text-muted">
              <span>Order ID</span><span>Customer</span><span>Items</span><span>Status</span><span>Total</span><span>Action</span>
            </div>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="sk" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  {Array.from({length:limit}).map((_,i)=>(
                    <div key={i} className="flex items-center gap-4 px-5 py-4 border-b">
                      <SkeletonPulse className="h-3 w-24"/><SkeletonPulse className="h-3 flex-1"/><SkeletonPulse className="h-6 w-20 rounded-full"/>
                    </div>
                  ))}
                </motion.div>
              ) : filtered.length===0 ? (
                <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} className="py-16 text-center">
                  <p className="text-muted text-sm">No orders found</p>
                </motion.div>
              ) : (
                <motion.div key="rows" initial={{opacity:0}} animate={{opacity:1}}>
                  {filtered.map((order,i)=>(
                    <motion.div key={order._id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
                      className="grid md:grid-cols-[140px_1fr_100px_130px_90px_90px] gap-4 items-center px-5 py-4 border-b hover:bg-accent/[0.03] transition-colors cursor-pointer group"
                      onClick={()=>setSelected(order)}>
                      <div>
                        <p className="font-mono text-xs text-accent font-bold">#{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short'})}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{order.shippingAddress?.fullName||'—'}</p>
                        <p className="text-xs text-muted truncate">{order.shippingAddress?.phone} · {order.shippingAddress?.city}</p>
                      </div>
                      <p className="text-sm text-muted hidden md:block">{order.items?.length||0} item{order.items?.length!==1?'s':''}</p>
                      <div className="hidden md:block"><StatusBadge status={order.status}/></div>
                      <p className="text-sm font-bold text-foreground/90 hidden md:block">Rs {order.total?.toLocaleString()}</p>
                      <button onClick={e=>{e.stopPropagation();setSelected(order)}}
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-themed text-xs text-muted hover:border-accent/40 hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
                        View <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      </button>
                      <div className="md:hidden col-span-full flex items-center justify-between mt-1">
                        <StatusBadge status={order.status}/>
                        <p className="text-sm font-bold text-accent">Rs {order.total?.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {!loading && totalPages>1 && (
              <div className="px-5 py-4 border-t border-themed flex items-center justify-between">
                <p className="text-xs text-muted">{total} orders · page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                    className="px-3 py-1.5 border-themed rounded-lg text-xs text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Prev</button>
                  {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                    const p=page<=3?i+1:page+i-2
                    if(p<1||p>totalPages) return null
                    return <button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${p===page?'bg-accent text-white':'border-themed text-muted hover:text-foreground'}`}>{p}</button>
                  })}
                  <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                    className="px-3 py-1.5 border-themed rounded-lg text-xs text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next →</button>
                </div>
              </div>
            )}
          </div>
        </>)}

        {activeTab==='products' && (
          <ProductsTab products={products} loading={prodLoading}
            onAdd={()=>setProdModal('add')}
            onEdit={(p)=>setProdModal(p)}
            onDelete={async (id)=>{
              if(!confirm('Delete this product?')) return
              setProdDeleting(id)
              try { await deleteProduct(id); setProducts(prev=>prev.filter(p=>p._id!==id)) }
              finally { setProdDeleting(null) }
            }}
            deleting={prodDeleting}/>
        )}
      </div>

      <AnimatePresence>
        {selected && <OrderModal key={selected._id} order={selected} onClose={()=>setSelected(null)} onStatusUpdate={handleStatusUpdate}/>}
      </AnimatePresence>
      <AnimatePresence>
        {prodModal && <ProductFormModal key="pf" product={prodModal} onClose={()=>setProdModal(null)} onSaved={handleProductSaved}/>}
      </AnimatePresence>
    </div>
  )
}
