import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence, useAnimate, stagger } from 'framer-motion'
import { useCart } from '../hooks/useCart'

const navLinks = [
  { to: '/',            label: 'Home',        num: '01' },
  { to: '/shop',        label: 'Shop',        num: '02' },
  { to: '/collections', label: 'Collections', num: '03' },
  { to: '/about',       label: 'About',       num: '04' },
  { to: '/contact',     label: 'Contact',     num: '05' },
  { to: '/orders',      label: 'Track Order', num: '06' },
]

export default function StaggeredMobileMenu({ isOpen, onClose, onCartClick }) {
  const { itemCount } = useCart()
  const [scope, animate] = useAnimate()

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Stagger animate items on open/close
  useEffect(() => {
    if (!scope.current) return
    if (isOpen) {
      animate('.menu-item', 
        { opacity: 1, y: 0, filter: 'blur(0px)' },
        { duration: 0.55, delay: stagger(0.07, { startDelay: 0.25 }), ease: [0.22, 1, 0.36, 1] }
      )
      animate('.menu-deco',
        { opacity: 1, scaleX: 1 },
        { duration: 0.6, delay: stagger(0.07, { startDelay: 0.25 }), ease: [0.22, 1, 0.36, 1] }
      )
      animate('.menu-footer',
        { opacity: 1, y: 0 },
        { duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }
      )
    } else {
      animate('.menu-item', 
        { opacity: 0, y: 30, filter: 'blur(4px)' },
        { duration: 0.25, delay: stagger(0.03, { from: 'last' }), ease: [0.22, 1, 0.36, 1] }
      )
      animate('.menu-footer',
        { opacity: 0, y: 10 },
        { duration: 0.2 }
      )
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(4,4,4,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[70] flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #0d0d0d 0%, #080808 60%, #0a0303 100%)',
            }}
            ref={scope}
          >
            {/* Decorative red corner glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(200,16,46,0.12) 0%, transparent 65%)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle at bottom left, rgba(200,16,46,0.07) 0%, transparent 65%)' }}
            />

            {/* Header bar */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
              <Link to="/" onClick={onClose} className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold tracking-tight text-foreground">PREMIUM</span>
                <span className="text-[9px] tracking-superwide text-muted font-sans uppercase mt-0.5">Pakistan</span>
              </Link>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center border border-white/[0.1] text-muted hover:text-foreground hover:border-white/30 transition-all rounded-xl"
                aria-label="Close menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-6 gap-1">
              {navLinks.map(({ to, label, num }) => (
                <div key={to} className="menu-item overflow-hidden" style={{ opacity: 0, transform: 'translateY(30px)', filter: 'blur(4px)' }}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-4 py-4 border-b transition-all duration-200 ${
                        isActive
                          ? 'border-accent/30'
                          : 'border-white/[0.05] hover:border-white/[0.12]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="text-[10px] font-mono text-muted/50 w-6 flex-shrink-0 group-hover:text-accent/60 transition-colors">
                          {num}
                        </span>
                        <span
                          className={`font-display text-[2.2rem] font-bold leading-none tracking-tight transition-colors duration-200 ${
                            isActive ? 'text-accent' : 'text-foreground/90 group-hover:text-foreground'
                          }`}
                        >
                          {label}
                        </span>
                        <svg
                          className="w-5 h-5 ml-auto text-muted/0 group-hover:text-accent -translate-x-2 group-hover:translate-x-0 transition-all duration-250 flex-shrink-0"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Footer actions */}
            <div
              className="menu-footer px-6 pb-8 pt-5 flex items-center gap-3"
              style={{ opacity: 0, transform: 'translateY(10px)' }}
            >
              <button
                onClick={() => { onCartClick(); onClose() }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-accent text-white text-sm font-semibold rounded-xl accent-glow hover:bg-accent/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                Cart {itemCount > 0 && `(${itemCount})`}
              </button>
              <Link
                to="/shop"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-white/[0.1] text-sm font-semibold text-muted hover:text-foreground hover:border-white/20 rounded-xl transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
