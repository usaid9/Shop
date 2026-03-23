import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

// Map path segments to labels
const labelMap = {
  shop: 'Shop',
  collections: 'Collections',
  product: 'Product',
  about: 'About',
  contact: 'Contact',
  orders: 'Track Order',
  shirts: 'Shirts',
  trousers: 'Trousers',
  jackets: 'Jackets',
  shoes: 'Shoes',
  watches: 'Watches',
  accessories: 'Accessories',
  kurta: 'Kurta & Shalwar',
}

/**
 * @param {Object} props
 * @param {Array<{label:string, to?:string}>} [props.custom] — override auto-detection
 */
export default function Breadcrumb({ custom }) {
  const location = useLocation()

  const crumbs = custom ?? (() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const result = [{ label: 'Home', to: '/' }]
    parts.forEach((part, i) => {
      const to = '/' + parts.slice(0, i + 1).join('/')
      result.push({ label: labelMap[part] ?? part, to: i < parts.length - 1 ? to : undefined })
    })
    return result
  })()

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
      {crumbs.map((crumb, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.25 }}
          className="flex items-center gap-1.5"
        >
          {i > 0 && (
            <svg className="w-2.5 h-2.5 text-muted/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="underline-hover text-muted hover:text-accent transition-colors duration-200"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground/70 font-medium truncate max-w-[180px]">{crumb.label}</span>
          )}
        </motion.span>
      ))}
    </nav>
  )
}
