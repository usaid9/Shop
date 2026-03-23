import React from 'react'
import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useTheme } from '../hooks/useTheme'

const navLinks = [
  { to: '/',            label: 'Home',        num: '01' },
  { to: '/shop',        label: 'Shop',        num: '02' },
  { to: '/collections', label: 'Collections', num: '03' },
  { to: '/about',       label: 'About',       num: '04' },
  { to: '/contact',     label: 'Contact',     num: '05' },
  { to: '/orders',      label: 'Track Order', num: '06' },
]

function SlotReveal({ children, delay = 0, className = '' }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.div
        className={className}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        exit={{ y: '110%' }}
        transition={{
          duration: 0.65,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function StaggeredMobileMenu({ isOpen, onClose, onCartClick }) {
  const { itemCount } = useCart()
  const { isDark } = useTheme()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
            style={{ background: isDark ? 'rgba(4,4,4,0.5)' : 'rgba(200,16,46,0.15)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col"
            style={{ background: 'var(--surface-mobile-menu)' }}
          >
            {/* Corner glows */}
            <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(200,16,46,0.14) 0%, transparent 65%)' }} />
            <div className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none"
              style={{ background: 'radial-gradient(circle at bottom left, rgba(200,16,46,0.07) 0%, transparent 65%)' }} />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border-default)' }}
            >
              <SlotReveal delay={0.15}>
                <Link to="/" onClick={onClose} className="flex flex-col leading-none">
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground">PREMIUM</span>
                  <span className="text-[9px] tracking-superwide text-muted font-sans uppercase mt-0.5">Pakistan</span>
                </Link>
              </SlotReveal>
              <SlotReveal delay={0.18}>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center text-muted hover:text-foreground transition-all rounded-xl"
                  style={{ border: '1px solid var(--border-default)' }}
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </SlotReveal>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-6 overflow-hidden">
              {navLinks.map(({ to, label, num }, i) => (
                <div key={to} style={{ borderBottom: i < navLinks.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={onClose}
                  >
                    {({ isActive }) => (
                      <div className="group flex items-center gap-4 py-3">
                        <SlotReveal delay={0.25 + i * 0.07}>
                          <span className="text-[10px] font-mono text-muted/40 w-6 flex-shrink-0 group-hover:text-accent/70 transition-colors">
                            {num}
                          </span>
                        </SlotReveal>

                        <SlotReveal
                          delay={0.28 + i * 0.07}
                          className={`font-display font-bold leading-none tracking-tight transition-colors duration-150 ${
                            isActive ? 'text-accent' : 'text-foreground/85 group-hover:text-foreground'
                          }`}
                        >
                          <span style={{ fontSize: 'clamp(1.6rem, 7vw, 2.2rem)', display: 'block' }}>{label}</span>
                        </SlotReveal>

                        <SlotReveal delay={0.3 + i * 0.07}>
                          <svg
                            className="w-4 h-4 ml-auto text-transparent group-hover:text-accent -translate-x-2 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </SlotReveal>
                      </div>
                    )}
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Footer CTAs */}
            <div
              className="px-6 pb-8 pt-4 flex items-center gap-3 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <SlotReveal delay={0.72}>
                <button
                  onClick={() => { onCartClick(); onClose() }}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 bg-accent text-white text-sm font-semibold rounded-xl accent-glow hover:bg-accent/90 transition-colors w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                  </svg>
                  Cart{itemCount > 0 ? ` (${itemCount})` : ''}
                </button>
              </SlotReveal>
              <SlotReveal delay={0.76}>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex items-center justify-center py-3.5 px-6 text-sm font-semibold text-muted hover:text-foreground hover:border-accent/30 rounded-xl transition-colors w-full"
                  style={{ border: '1px solid var(--border-default)' }}
                >
                  Shop Now
                </Link>
              </SlotReveal>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
