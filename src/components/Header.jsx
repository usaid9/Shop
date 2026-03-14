import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import StaggeredMobileMenu from './StaggeredMobileMenu'

const navLinks = [
  { to: '/',            label: 'Home' },
  { to: '/shop',        label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/about',       label: 'About' },
  { to: '/contact',     label: 'Contact' },
  { to: '/orders',      label: 'Track Order' },
]

export default function Header({ onCartClick }) {
  const { itemCount } = useCart()
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
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
        }`}
        style={scrolled ? {
          background: 'linear-gradient(180deg, rgba(8,8,8,0.96) 0%, rgba(10,10,10,0.92) 100%)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 40px -4px rgba(0,0,0,0.8), 0 0 80px -20px rgba(200,16,46,0.08)',
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group" aria-label="Premium PK Home">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors duration-300">
                PREMIUM
              </span>
              <span className="text-[9px] tracking-superwide text-muted font-sans font-light uppercase mt-0.5 group-hover:text-accent/60 transition-colors duration-300">
                Pakistan
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" onMouseLeave={() => setHoveredLink(null)}>
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onMouseEnter={() => setHoveredLink(to)}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors duration-200 py-1 ${
                      isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <motion.span
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                        initial={false}
                        animate={{
                          scaleX: hoveredLink === to || isActive ? 1 : 0,
                          opacity: hoveredLink === to || isActive ? 1 : 0,
                        }}
                        style={{ transformOrigin: 'left' }}
                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search — desktop only */}
              <button
                className="hidden sm:flex p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              {/* Cart */}
              <motion.button
                onClick={onCartClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <motion.span
                    animate={isMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="block h-px w-full bg-foreground rounded-full"
                  />
                  <motion.span
                    animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.18 }}
                    className="block h-px w-full bg-foreground rounded-full"
                  />
                  <motion.span
                    animate={isMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="block h-px w-full bg-foreground rounded-full"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen staggered mobile menu — rendered outside header to cover everything */}
      <StaggeredMobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onCartClick={onCartClick}
      />
    </>
  )
}
