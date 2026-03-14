import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider } from './hooks/useCart'
import Header from './components/Header'
import Footer from './components/Footer'
import ShoppingCart from './components/ShoppingCart'
import Checkout from './components/Checkout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CollectionsPage from './pages/CollectionsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import OrdersPage from './pages/OrdersPage'
import ProductDetailPage from './pages/ProductDetailPage'
import NotFoundPage from './pages/NotFoundPage'

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
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <CartProvider>
      <div className="relative w-full min-h-screen bg-primary text-foreground overflow-x-hidden">
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onCartClick={() => setIsCartOpen(true)} />
          <main className="flex-1">
            <Routes>
              <Route path="/"             element={<HomePage openCart={() => setIsCartOpen(true)} />} />
              <Route path="/shop"         element={<ShopPage />} />
              <Route path="/shop/:category" element={<ShopPage />} />
              <Route path="/collections"  element={<CollectionsPage />} />
              <Route path="/product/:id"  element={<ProductDetailPage />} />
              <Route path="/about"        element={<AboutPage />} />
              <Route path="/contact"      element={<ContactPage />} />
              <Route path="/orders"       element={<OrdersPage />} />
              <Route path="*"             element={<NotFoundPage />} />
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
      </div>
    </CartProvider>
  )
}
