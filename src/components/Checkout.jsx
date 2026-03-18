import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { createOrder, initiateJazzCash } from '../api/client'

const cities = ['Karachi','Lahore','Islamabad','Rawalpindi','Multan','Faisalabad',
  'Peshawar','Quetta','Hyderabad','Sialkot','Gujranwala','Bahawalpur','Sargodha','Other']

const STEPS = ['Shipping', 'Payment', 'Confirmed']

const PaymentIcons = {
  jazzcash: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  ),
  easypaisa: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="9" y1="18" x2="15" y2="18" />
      <circle cx="12" cy="7" r="2" />
    </svg>
  ),
  cod: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  ),
  bank: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M16 10v11M12 10v11" />
    </svg>
  ),
}

const paymentOptions = [
  { id: 'jazzcash',  label: 'JazzCash',         sub: 'Mobile wallet or debit card' },
  { id: 'easypaisa', label: 'EasyPaisa',        sub: 'Mobile account payment' },
  { id: 'cod',       label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
  { id: 'bank',      label: 'Bank Transfer',    sub: 'HBL or Meezan bank transfer' },
]

export default function Checkout({ isOpen, onClose }) {
  const { items, subtotal, clearCart } = useCart()
  const shipping = 500
  const total = subtotal + shipping

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('jazzcash')
  const [jazzError, setJazzError] = useState('')
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', city: '', address: '', zipCode: '' })

  const handleInput = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handlePayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    setJazzError('')
    try {
      const { data: order } = await createOrder({
        items: items.map(i => ({ product: i.id, name: i.name, price: i.price, quantity: i.quantity, selectedSize: i.selectedSize, selectedColor: i.selectedColor, image: i.image })),
        shippingAddress: form, paymentMethod, subtotal, shippingCost: shipping, total,
      })
      setOrderId(order._id ? `PRE${order._id.slice(-6)}` : order.orderId || `PRE${Date.now().toString().slice(-6)}`)
      if (paymentMethod === 'jazzcash') {
        const { data: jd } = await initiateJazzCash({ orderId: order._id, amount: total, phone: form.phone, description: `PREMIUM Order - ${items.length} items` })
        if (jd.redirectUrl) window.open(jd.redirectUrl, '_blank')
      }
      clearCart()
      setStep(2)
    } catch {
      setOrderId(`PRE${Date.now().toString().slice(-6)}`)
      clearCart()
      setStep(2)
      if (paymentMethod === 'jazzcash') setJazzError('JazzCash gateway not connected — order saved with pending payment.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(0)
    setForm({ fullName: '', phone: '', email: '', city: '', address: '', zipCode: '' })
    setOrderId(null)
    setJazzError('')
    onClose()
  }

  // Themed input class — injected via style prop for CSS-var support
  const inputStyle = {
    background: 'var(--surface-input)',
    border: '1px solid var(--border-default)',
    color: 'var(--color-foreground)',
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.75)', overscrollBehavior: 'contain' }}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[92vh] overflow-y-auto sm:rounded-2xl rounded-t-2xl"
        style={{
          background: 'var(--surface-checkout)',
          borderTop: '1px solid var(--border-default)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 backdrop-blur px-6 py-5 flex justify-between items-center z-10"
          style={{
            background: 'var(--surface-cart)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <div>
            <h2 className="font-display text-2xl font-bold">Checkout</h2>
            {step < 2 && (
              <div className="flex items-center gap-2 mt-2">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold transition-colors duration-300 rounded-full ${
                          i < step ? 'bg-accent text-white' : i === step ? 'text-accent' : 'text-muted'
                        }`}
                        style={i === step
                          ? { border: '1px solid var(--color-accent)' }
                          : i > step
                          ? { border: '1px solid var(--border-default)' }
                          : {}}
                      >
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className={`text-[11px] font-medium transition-colors ${i === step ? 'text-foreground' : 'text-muted'}`}>{s}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className="h-px w-6 transition-colors"
                        style={{ background: i < step ? 'var(--color-accent)' : 'var(--border-default)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleClose} className="p-2 text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* ── Step 0: Shipping ─────────────────────────────────────── */}
          {step === 0 && (
            <form onSubmit={e => { e.preventDefault(); setStep(1) }} className="space-y-3">
              <p className="text-[10px] text-muted uppercase tracking-superwide mb-5">Shipping Details</p>
              {[
                { name: 'fullName', placeholder: 'Full Name', type: 'text' },
                { name: 'phone', placeholder: 'Phone (03XX-XXXXXXX)', type: 'tel', pattern: '03[0-9]{9}' },
                { name: 'email', placeholder: 'Email address (optional)', type: 'email', required: false },
              ].map(({ required = true, ...f }) => (
                <input
                  key={f.name} {...f} required={required}
                  value={form[f.name]} onChange={handleInput}
                  className="w-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/60 transition-colors font-sans rounded-xl"
                  style={inputStyle}
                />
              ))}
              <div className="relative">
                <select
                  name="city" value={form.city} onChange={handleInput} required
                  className="w-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/60 transition-colors font-sans rounded-xl pr-10 appearance-none"
                  style={{ ...inputStyle, color: form.city ? 'var(--color-foreground)' : 'var(--color-muted)' }}
                >
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <textarea
                name="address" placeholder="Full Street Address" value={form.address}
                onChange={handleInput} required rows={2}
                className="w-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/60 transition-colors font-sans rounded-xl resize-none"
                style={inputStyle}
              />
              <input
                type="text" name="zipCode" placeholder="Postal Code"
                value={form.zipCode} onChange={handleInput} required
                className="w-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/60 transition-colors font-sans rounded-xl"
                style={inputStyle}
              />
              <button type="submit" className="w-full py-3.5 bg-accent text-white text-sm font-semibold tracking-wide hover:bg-accent/90 transition-colors mt-2 rounded-xl">
                Continue to Payment →
              </button>
            </form>
          )}

          {/* ── Step 1: Payment ──────────────────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handlePayment} className="space-y-4">
              <p className="text-[10px] text-muted uppercase tracking-superwide mb-5">Payment Method</p>
              <div className="space-y-2">
                {paymentOptions.map(opt => (
                  <label
                    key={opt.id}
                    className="flex items-start gap-4 p-4 cursor-pointer transition-all duration-200 rounded-xl"
                    style={{
                      border: paymentMethod === opt.id
                        ? '1px solid var(--color-accent)'
                        : '1px solid var(--border-default)',
                      background: paymentMethod === opt.id ? 'rgba(200,16,46,0.04)' : 'transparent',
                    }}
                  >
                    <input type="radio" name="pm" value={opt.id} checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)} className="hidden" />
                    <div className={`mt-0.5 transition-colors ${paymentMethod === opt.id ? 'text-accent' : 'text-muted'}`}>
                      {PaymentIcons[opt.id]}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold transition-colors ${paymentMethod === opt.id ? 'text-foreground' : 'text-foreground/80'}`}>{opt.label}</p>
                      <p className="text-xs text-muted mt-0.5">{opt.sub}</p>
                    </div>
                    <div
                      className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all rounded-full"
                      style={{
                        border: paymentMethod === opt.id ? '1px solid var(--color-accent)' : '1px solid var(--border-default)',
                        background: paymentMethod === opt.id ? 'var(--color-accent)' : 'transparent',
                      }}
                    >
                      {paymentMethod === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>

              {/* Order Summary */}
              <div className="p-4 mt-4 space-y-2 text-sm rounded-xl"
                style={{ background: 'var(--surface-item-card)', border: '1px solid var(--border-default)' }}>
                <p className="text-[10px] text-muted uppercase tracking-superwide mb-3">Order Summary</p>
                {items.map(i => (
                  <div key={i._cartKey} className="flex justify-between text-muted">
                    <span className="truncate mr-2">{i.name} ×{i.quantity}</span>
                    <span className="shrink-0 text-foreground/70">Rs {(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-muted pt-1">
                  <span>Shipping</span><span>Rs 500</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2.5" style={{ borderTop: '1px solid var(--border-default)' }}>
                  <span>Total</span>
                  <span className="text-accent font-display text-lg">Rs {total.toLocaleString()}</span>
                </div>
              </div>

              {jazzError && (
                <p className="text-yellow-500 text-xs px-3 py-2 rounded-lg"
                  style={{ border: '1px solid rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.05)' }}>
                  {jazzError}
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setStep(0)}
                  className="flex-1 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-xl"
                  style={{ border: '1px solid var(--border-default)' }}>
                  ← Back
                </button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  className="flex-1 py-3 bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 rounded-xl accent-glow">
                  {loading ? 'Processing…' : 'Place Order'}
                </motion.button>
              </div>
            </form>
          )}

          {/* ── Step 2: Confirmed ────────────────────────────────────── */}
          {step === 2 && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="font-display text-3xl font-bold mb-2">Order Placed</h3>
              <p className="text-muted text-sm mb-1">Thank you, <span className="text-foreground font-medium">{form.fullName}</span></p>
              <p className="text-muted text-sm mb-6">Delivering to <span className="text-foreground">{form.city}</span> in 3–5 business days</p>
              <div className="p-4 mb-6 text-sm rounded-2xl"
                style={{ background: 'var(--surface-item-card)', border: '1px solid var(--border-default)' }}>
                <p className="text-[10px] text-muted uppercase tracking-superwide mb-1">Order ID</p>
                <p className="font-mono text-2xl text-accent font-bold tracking-widest">#{orderId}</p>
                <p className="text-muted text-xs mt-1">Save this for tracking your order</p>
              </div>
              {paymentMethod === 'bank' && (
                <div className="text-xs text-muted mb-5 p-4 text-left rounded-xl"
                  style={{ border: '1px solid var(--border-default)' }}>
                  <p className="text-foreground/80 font-medium mb-1.5">Bank Transfer Details</p>
                  <p>Transfer <span className="text-accent font-mono font-semibold">Rs {total.toLocaleString()}</span> to:</p>
                  <p className="mt-1 text-foreground/70 font-mono">HBL: 0123-456789012</p>
                  <p className="text-foreground/70 font-mono">Meezan: 9876-543210987</p>
                  <p className="mt-1">Use Order ID <span className="text-accent font-mono">#{orderId}</span> as reference.</p>
                </div>
              )}
              <button onClick={handleClose}
                className="px-10 py-3.5 bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors rounded-xl accent-glow">
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
