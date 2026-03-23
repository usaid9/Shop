import React from 'react'
import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider } from './hooks/useCart'
import { ThemeProvider } from './hooks/useTheme'
import { WishlistProvider } from './hooks/useWishlist'
import Header from './components/Header'
import Footer from './components/Footer'
import ShoppingCart from './components/ShoppingCart'
import Checkout from './components/Checkout'
import WishlistPanel from './components/WishlistPanel'
import SearchOverlay from './components/SearchOverlay'
import ScrollVideoBackground from './components/ScrollVideoBackground'
import ThreeDBackground from './components/ThreeDBackground'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CollectionsPage from './pages/CollectionsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import OrdersPage from './pages/OrdersPage'
import ProductDetailPage from './pages/ProductDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/AdminPage'

function PageTransition({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [isCartOpen,     setIsCartOpen]     = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isSearchOpen,   setIsSearchOpen]   = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(s => !s)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <ThemeProvider>
      <WishlistProvider>
        <CartProvider>
          {/* ── Global background stack (all pages) ── */}
          <ThreeDBackground />
          <div id="glow-ambient" aria-hidden="true" />
          <ScrollVideoBackground />

          <div className="relative z-10 w-full min-h-screen text-foreground overflow-x-hidden flex flex-col">
            <Header
              onCartClick={() => setIsCartOpen(true)}
              onWishlistClick={() => setIsWishlistOpen(true)}
              onSearchClick={() => setIsSearchOpen(true)}
            />
            <main className="flex-1">
              <Routes>
                <Route path="/"              element={<HomePage openCart={() => setIsCartOpen(true)} />} />
                <Route path="/shop"          element={<ShopPage />} />
                <Route path="/shop/:category" element={<ShopPage />} />
                <Route path="/collections"   element={<CollectionsPage />} />
                <Route path="/product/:id"   element={<ProductDetailPage />} />
                <Route path="/about"         element={<AboutPage />} />
                <Route path="/contact"       element={<ContactPage />} />
                <Route path="/orders"        element={<OrdersPage />} />
                <Route path="/admin"         element={<AdminPage />} />
                <Route path="*"              element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>

          <ShoppingCart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true) }}
          />
          <Checkout
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
          <WishlistPanel
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
          />
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  )
}
