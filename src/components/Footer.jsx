import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { subscribeNewsletter } from '../api/client'

const TruckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-7 12h8a2 2 0 002-2v-5l-3-4H13V17m0 0H8m0 0a2 2 0 11-4 0 2 2 0 014 0zm9 0a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)
const ReturnIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)
const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState(null)
  const year = new Date().getFullYear()

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try { await subscribeNewsletter(email) } catch {}
    setSubStatus('ok')
    setEmail('')
    setTimeout(() => setSubStatus(null), 4000)
  }

  const cols = [
    {
      title: 'Shop',
      links: [
        { label: 'New Arrivals', to: '/shop?filter=new' },
        { label: 'Best Sellers', to: '/shop?sort=popular' },
        { label: 'Shirts', to: '/shop/shirts' },
        { label: 'Trousers', to: '/shop/trousers' },
        { label: 'Jackets', to: '/shop/jackets' },
        { label: 'Kurta & Shalwar', to: '/shop/kurta' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', to: '/contact' },
        { label: 'Track Order', to: '/orders' },
        { label: 'Shipping Info', to: '/contact#shipping' },
        { label: 'Returns', to: '/contact#returns' },
        { label: 'FAQ', to: '/contact#faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Collections', to: '/collections' },
        { label: 'Privacy Policy', to: '/about#privacy' },
        { label: 'Terms of Use', to: '/about#terms' },
        { label: 'Careers', to: '/about#careers' },
      ],
    },
  ]

  const socials = [
    {
      label: 'Facebook', href: 'https://facebook.com',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
    },
    {
      label: 'Instagram', href: 'https://instagram.com',
      icon: <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </>,
    },
    {
      label: 'WhatsApp', href: 'https://wa.me/923001234567',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />,
    },
  ]

  const trust = [
    { Icon: TruckIcon, title: 'Free Shipping', sub: 'On orders over Rs 5,000' },
    { Icon: ReturnIcon, title: 'Easy Returns', sub: '7-day return policy' },
    { Icon: LockIcon, title: 'Secure Payment', sub: 'JazzCash & EasyPaisa' },
    { Icon: StarIcon, title: 'Quality Assured', sub: 'Premium materials only' },
  ]

  return (
    <footer className="relative z-20 border-t border-white/[0.06]" style={{ background: 'linear-gradient(180deg, #101010 0%, #0c0c0c 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
      {/* Trust bar */}
      <div className="border-b border-white/[0.05]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trust.map(({ Icon, title, sub }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 group"
              >
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-white/[0.08] text-accent group-hover:border-accent/40 group-hover:bg-accent/[0.06] transition-all duration-300 rounded-xl">
                  <Icon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground/90">{title}</p>
                  <p className="text-xs text-muted mt-0.5">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex flex-col leading-none mb-5">
              <span className="font-display text-3xl font-bold text-foreground" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.8), 0 -1px 0 rgba(255,255,255,0.04)' }}>PREMIUM</span>
              <span className="text-[9px] text-muted tracking-superwide uppercase mt-0.5">Pakistan</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs mb-6">
              Premium men's fashion for the modern Pakistani gentleman — crafted for those who demand excellence.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {['JazzCash', 'EasyPaisa', 'HBL', 'COD'].map(p => (
                <span key={p} className="text-[10px] border border-white/[0.07] px-2.5 py-1 text-muted tracking-wide" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              viewport={{ once: true }}
            >
              <h4 className="text-[10px] font-semibold uppercase tracking-superwide text-foreground/70 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-muted underline-hover hover:text-accent transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="p-6 mb-10 relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(200,16,46,0.03) 100%)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px -4px rgba(0,0,0,0.6)' }}>
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(200,16,46,0.06) 0%, transparent 70%)' }} />
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between relative">
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-1">Subscribe to our newsletter</h4>
              <p className="text-muted text-sm">Exclusive deals and new arrivals directly to you.</p>
            </div>
            {subStatus === 'ok' ? (
              <p className="text-green-400 text-sm font-medium whitespace-nowrap">
                <span className="mr-1.5">✓</span>Subscribed — thank you.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0 w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 sm:w-60 px-4 py-2.5 border border-white/[0.08] border-r-0 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent transition-colors rounded-l-xl"
                  style={{ background: 'rgba(8,8,8,0.8)' }}
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap accent-glow rounded-r-xl"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.05]">
          <p className="text-muted text-xs">© {year} PREMIUM Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center border border-white/[0.07] text-muted hover:text-accent hover:border-accent/40 transition-all duration-200 rounded-lg"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
