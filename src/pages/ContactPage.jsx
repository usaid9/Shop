import React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Breadcrumb from '../components/Breadcrumb'
import ScrollFloat from '../components/ScrollFloat'

const faqs = [
  { q: 'How long does delivery take?',          a: '3–5 business days to most cities in Pakistan. Express 1–2 day delivery available in Karachi, Lahore, and Islamabad for Rs 1,000.' },
  { q: 'Can I return or exchange a product?',   a: 'Yes! We offer a 7-day return and exchange policy. Items must be unused with original tags. WhatsApp us at 0300-1234567.' },
  { q: 'Which payment methods do you accept?',  a: 'JazzCash, EasyPaisa, bank transfer (HBL/Meezan), and Cash on Delivery (COD) across Pakistan.' },
  { q: 'How do I track my order?',              a: "Go to the Track Order page and enter your Order ID or phone number. You'll also receive an SMS update when your order is dispatched." },
  { q: 'Do you offer bulk / wholesale orders?', a: 'Yes! For orders of 10+ pieces, contact us at wholesale@premium.pk for special pricing.' },
  { q: 'Is the quality guaranteed?',            a: 'Absolutely. Every product goes through quality control before dispatch. If you receive a defective item, we will replace it immediately.' },
]

const contactInfo = [
  { key: 'whatsapp', title: 'WhatsApp', value: '0300-1234567',                  href: 'https://wa.me/923001234567',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /> },
  { key: 'email',    title: 'Email',    value: 'support@premium.pk',             href: 'mailto:support@premium.pk',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
  { key: 'office',   title: 'Office',   value: 'Main Boulevard Gulberg III, Lahore', href: '#',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
  { key: 'hours',    title: 'Hours',    value: 'Mon–Sat: 10am – 7pm PKT',        href: null,
    icon: <><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" /></> },
]

const inputClass = "w-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent/60 text-sm transition-colors font-sans rounded-xl"
const inputStyle = { background: 'var(--surface-input)', border: '1px solid var(--border-default)', color: 'var(--color-foreground)' }

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent]       = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleInput  = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="pt-[68px] min-h-screen">
      {/* Header */}
      <div className="py-10 px-4 sm:px-6 lg:px-8"
        style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-cart)", boxShadow: "inset 0 1px 0 var(--inset-highlight)" }}>
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-4">
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Get In Touch
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              <ScrollFloat scrollOffset={['start 95%', 'start 60%']}>Contact </ScrollFloat>
              <ScrollFloat scrollOffset={['start 93%', 'start 55%']} accentWords={['Us']}>Us</ScrollFloat>
            </h1>
            <p className="text-muted mt-3 text-sm max-w-md">Questions about an order, product, or partnership? We're here to help.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* Left: Contact info */}
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-6 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Reach Us
            </p>
            <div className="space-y-3 mb-10">
              {contactInfo.map(({ key, title, value, href, icon }) => (
                <div key={key} className="flex items-start gap-4 panel-inset border-subtle-themed p-4 group hover:border-accent/20 transition-colors rounded-xl">
                  <div className="w-9 h-9 flex-shrink-0 border-themed flex items-center justify-center text-accent group-hover:border-accent/40 group-hover:bg-accent/[0.06] transition-all rounded-lg">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">{title}</p>
                    {href && href !== '#' ? (
                      <a href={href} className="text-sm text-foreground/90 underline-hover hover:text-accent transition-colors font-medium">{value}</a>
                    ) : (
                      <p className="text-sm text-foreground/90 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted uppercase tracking-superwide mb-3">Follow Us</p>
            <div className="flex gap-2">
              {[
                { label: 'Instagram', href: 'https://instagram.com' },
                { label: 'Facebook',  href: 'https://facebook.com' },
                { label: 'TikTok',    href: 'https://tiktok.com' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="px-4 py-2 border-themed text-xs text-muted hover:text-accent hover:border-accent/30 transition-all underline-hover rounded-lg">
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-6 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Send a Message
            </p>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-64 text-center gap-4 border border-green-500/20 bg-green-500/[0.04] rounded-2xl"
              >
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-sm text-foreground">Message sent</p>
                  <p className="text-muted text-xs mt-1">We'll get back to you within 24 hours</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="name"  placeholder="Full Name"  value={form.name}  onChange={handleInput} required className={inputClass} style={inputStyle} />
                  <input name="phone" type="tel" placeholder="Phone" value={form.phone} onChange={handleInput} className={inputClass} style={inputStyle} />
                </div>
                <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleInput} required className={inputClass} style={inputStyle} />
                <div className="relative">
                  <select name="subject" value={form.subject} onChange={handleInput} required
                    className={`${inputClass} ${form.subject ? '' : 'text-muted/40'} pr-10`}
                    style={{ ...inputStyle, colorScheme: 'dark' }}>
                    <option value="" style={{ background: 'var(--color-secondary)', color: 'var(--color-muted)' }}>Subject</option>
                    {['Order Issue', 'Product Inquiry', 'Return / Exchange', 'Wholesale', 'Other'].map(s => (
                      <option key={s} value={s} style={{ background: 'var(--color-secondary)', color: 'var(--color-foreground)' }}>{s}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <textarea name="message" placeholder="Your message…" value={form.message} onChange={handleInput} required rows={5}
                  className={`${inputClass} resize-none`} style={inputStyle} />
                <button type="submit" className="w-full py-3.5 bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors rounded-xl accent-glow">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-20 pt-16 border-t border-themed">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-3 flex items-center justify-center gap-2">
              <span className="w-5 h-px bg-accent" /> Common Questions <span className="w-5 h-px bg-accent" />
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              <ScrollFloat scrollOffset={['start 90%', 'start 50%']}>FAQ</ScrollFloat>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto divide-y divide-white/[0.05]">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left text-sm font-medium text-foreground/90 hover:text-foreground transition-colors gap-4"
                >
                  <span>{faq.q}</span>
                  <motion.svg
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 flex-shrink-0 text-accent"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted text-sm pb-5 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
