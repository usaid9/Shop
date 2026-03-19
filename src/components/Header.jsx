import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useTheme } from '../hooks/useTheme'
import { useWishlist } from '../hooks/useWishlist'
import StaggeredMobileMenu from './StaggeredMobileMenu'

const navLinks = [
  { to: '/',            label: 'Home' },
  { to: '/shop',        label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/about',       label: 'About' },
  { to: '/contact',     label: 'Contact' },
  { to: '/orders',      label: 'Track Order' },
]

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative p-2 rounded-xl transition-all duration-300 group overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(200,16,46,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(200,16,46,0.08) 0%, rgba(200,16,46,0.04) 100%)',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(200,16,46,0.18)',
      }}
    >
      <motion.div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.12) 0%, transparent 70%)' }} />
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
            className="w-[18px] h-[18px] text-muted group-hover:text-accent transition-colors relative z-10"
            fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            {[0,45,90,135,180,225,270,315].map(deg => {
              const r = deg * Math.PI / 180
              const x1 = 12 + 7*Math.sin(r), y1 = 12 - 7*Math.cos(r)
              const x2 = 12 + 9*Math.sin(r), y2 = 12 - 9*Math.cos(r)
              return <line key={deg} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} strokeLinecap="round" />
            })}
          </motion.svg>
        ) : (
          <motion.svg key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.6 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
            className="w-[18px] h-[18px] text-accent relative z-10"
            fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function Header({ onCartClick, onWishlistClick, onSearchClick }) {
  const { itemCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setIsMenuOpen(false) }, [location.pathname])

  return (
    <>
      <header
        className="fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md"
        style={{
          background: scrolled ? 'var(--surface-header-scrolled)' : 'rgba(8, 8, 8, 0.4)',
          boxShadow: scrolled ? 'var(--shadow-header)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group" aria-label="Premium PK Home">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors duration-300">PREMIUM</span>
              <span className="text-[9px] tracking-superwide text-muted font-sans font-light uppercase mt-0.5 group-hover:text-accent/60 transition-colors duration-300">Pakistan</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" onMouseLeave={() => setHoveredLink(null)}>
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  onMouseEnter={() => setHoveredLink(to)}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors duration-200 py-1 ${isActive ? 'text-foreground' : 'text-muted hover:text-foreground'}`
                  }
                >
                  {({ isActive }) => (<>
                    {label}
                    <motion.span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                      initial={false}
                      animate={{ scaleX: hoveredLink === to || isActive ? 1 : 0, opacity: hoveredLink === to || isActive ? 1 : 0 }}
                      style={{ transformOrigin: 'left' }}
                      transition={{ duration: 0.22, ease: [0.25,0.46,0.45,0.94] }}
                    />
                  </>)}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1">

              {/* Search */}
              <motion.button onClick={onSearchClick}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="p-2 text-muted hover:text-foreground transition-colors group relative" 
                aria-label="Search (Ctrl+K)">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] text-muted/70 whitespace-nowrap hidden group-hover:block pointer-events-none px-1.5 py-0.5 rounded" style={{ background: 'var(--color-secondary)', border: '1px solid var(--border-default)' }}>⌘K</span>
              </motion.button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist */}
              <motion.button onClick={onWishlistClick}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative p-2 text-muted hover:text-foreground transition-colors" aria-label="Wishlist">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Cart */}
              <motion.button onClick={onCartClick}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative p-2 text-muted hover:text-foreground transition-colors" aria-label="Cart">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Hamburger — mobile */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-muted hover:text-foreground transition-colors" aria-label="Menu">
                <div className="w-5 h-4 flex flex-col justify-between">
                  <motion.span animate={isMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.22 }} className="block h-px w-full bg-foreground rounded-full" />
                  <motion.span animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.18 }} className="block h-px w-full bg-foreground rounded-full" />
                  <motion.span animate={isMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.22 }} className="block h-px w-full bg-foreground rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <StaggeredMobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onCartClick={onCartClick}
      />
    </>
  )
}
