import React from 'react'
/**
 * ProductCardSkeleton — ghost placeholder that perfectly mirrors ProductCard layout.
 * Supports both grid view (default) and list view.
 * Uses a shimmer animation that adapts to dark / light theme via CSS variables.
 */
export default function ProductCardSkeleton({ listView = false, index = 0 }) {
  const delay = `${index * 80}ms`

  if (listView) {
    return (
      <div
        className="flex gap-5 p-4 rounded-xl overflow-hidden"
        style={{
          background: 'var(--color-secondary)',
          border: '1px solid var(--border-subtle)',
          animationDelay: delay,
        }}
      >
        {/* Thumb */}
        <div className="skeleton-shimmer flex-shrink-0 w-24 h-28 rounded-lg" />

        {/* Info lines */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div className="skeleton-shimmer h-2.5 w-1/4 rounded-full" />
            <div className="skeleton-shimmer h-3.5 w-3/4 rounded-full" />
            <div className="skeleton-shimmer h-2.5 w-1/3 rounded-full" />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="skeleton-shimmer h-4 w-20 rounded-full" />
            <div className="skeleton-shimmer h-7 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--color-secondary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        animationDelay: delay,
      }}
    >
      {/* Image area */}
      <div className="skeleton-shimmer rounded-none" style={{ aspectRatio: '3/4', width: '100%' }} />

      {/* Info panel */}
      <div
        className="p-3.5 space-y-2.5"
        style={{ background: 'linear-gradient(to bottom, var(--color-secondary), var(--color-tertiary))' }}
      >
        {/* Category pill */}
        <div className="skeleton-shimmer h-2 w-1/4 rounded-full" />
        {/* Product name */}
        <div className="skeleton-shimmer h-3.5 w-4/5 rounded-full" />
        {/* Stars row */}
        <div className="flex items-center gap-1 pt-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-shimmer w-3 h-3 rounded-sm" />
          ))}
          <div className="skeleton-shimmer h-2 w-8 rounded-full ml-1" />
        </div>
        {/* Price */}
        <div className="skeleton-shimmer h-4 w-1/3 rounded-full" />
      </div>
    </div>
  )
}
