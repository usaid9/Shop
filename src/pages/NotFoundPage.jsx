import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="pt-[68px] min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        {/* Large 404 */}
        <p className="font-display text-[10rem] font-bold leading-none text-white/[0.04] select-none mb-0">
          404
        </p>
        <div className="-mt-8 mb-6">
          <svg className="w-12 h-12 mx-auto text-accent mb-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <h1 className="font-display text-3xl font-bold mb-2">Page not found</h1>
          <p className="text-muted text-sm leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <button className="px-8 py-3 bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors">
              Go Home
            </button>
          </Link>
          <Link to="/shop">
            <button className="px-8 py-3 border-themed text-muted text-sm hover:text-foreground transition-colors">
              Browse Shop
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
