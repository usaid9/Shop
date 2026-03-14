import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const LINES = ['Redefine', 'Your', 'Style.']

function TextReveal({ children, delay = 0, className = '' }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function Hero({ onShopClick }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const parallaxY = scrollY * 0.25

  return (
    <section className="relative h-screen w-full flex items-center justify-center pt-[68px] overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${parallaxY}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-primary/60 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(200,16,46,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_20%_80%,rgba(200,16,46,0.06),transparent)]" />
      </div>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.06,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '160px 160px',
        }}
      />

      {/* Vertical rule lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top' }}
          className="absolute left-[8%] sm:left-[12%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.09] to-transparent"
        />
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top' }}
          className="absolute right-[8%] sm:right-[12%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.09] to-transparent"
        />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex flex-col">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-8 h-px bg-accent" />
            <p className="text-accent text-[11px] tracking-superwide font-sans font-medium uppercase">
              Pakistan's Premium Men's Store
            </p>
          </motion.div>

          {/* Headline */}
          <div className="mb-10">
            <TextReveal delay={0.35} className="font-display text-[clamp(4rem,12vw,10rem)] font-bold leading-[0.88] text-foreground">
              Redefine
            </TextReveal>
            <div className="flex items-baseline gap-5 mt-1">
              <TextReveal delay={0.5} className="font-display text-[clamp(4rem,12vw,10rem)] font-bold leading-[0.88] text-foreground">
                Your&nbsp;
              </TextReveal>
              <TextReveal delay={0.62} className="font-display text-[clamp(4rem,12vw,10rem)] font-bold italic leading-[0.88] text-accent">
                Style.
              </TextReveal>
            </div>
          </div>

          {/* Sub + CTAs side by side */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="text-muted text-sm sm:text-base max-w-xs leading-relaxed"
            >
              Premium menswear crafted for those who demand excellence — from Karachi to Lahore.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="flex items-center gap-4"
            >
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 bg-accent text-white text-sm font-semibold tracking-wide hover:bg-accent-hover transition-colors duration-200 rounded-xl"
                >
                  Shop Now
                </motion.button>
              </Link>
              <Link to="/collections">
                <button className="group flex items-center gap-2 text-sm text-muted font-medium hover:text-foreground transition-colors">
                  <span className="underline-hover">Explore Collections</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex gap-10 mt-16 pt-10 border-t border-white/[0.07]"
          >
            {[
              { value: '200+', label: 'Products' },
              { value: '15K+', label: 'Customers' },
              { value: '50+',  label: 'Cities' },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-col relative">
                {i > 0 && <div className="absolute -left-5 top-1 bottom-1 w-px bg-white/[0.07]" />}
                <span
                  className="font-display text-3xl font-bold text-accent leading-none"
                  style={{ textShadow: '0 0 20px rgba(200,16,46,0.5), 0 0 40px rgba(200,16,46,0.2)' }}
                >
                  {s.value}
                </span>
                <span className="text-[10px] text-muted tracking-superwide uppercase mt-1.5 font-sans">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 right-10 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] text-muted tracking-superwide uppercase rotate-90 origin-center mb-4">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  )
}
