import React from 'react'
/**
 * GhostCard — themed skeleton loader with sweeping shimmer.
 * Uses the .ghost-block utility class defined in index.css.
 */

function GhostBlock({ className = '', style = {} }) {
  return <span className={`ghost-block block ${className}`} style={style} />
}

/** Grid ghost card — matches ProductCard grid dimensions exactly */
export function GhostCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      {/* Image area */}
      <GhostBlock className="rounded-none" style={{ aspectRatio: '3/4', background: 'var(--ghost-base)' }} />
      {/* Info area */}
      <div className="p-3.5 space-y-2.5" style={{ background: 'var(--ghost-panel)' }}>
        <GhostBlock style={{ height: 10, width: '52%', borderRadius: 4 }} />
        <GhostBlock style={{ height: 13, width: '82%', borderRadius: 4 }} />
        <div className="flex items-center gap-1 pt-0.5">
          {[...Array(5)].map((_, i) => (
            <GhostBlock key={i} style={{ width: 10, height: 10, borderRadius: '50%' }} />
          ))}
          <GhostBlock style={{ height: 9, width: 24, marginLeft: 4, borderRadius: 4 }} />
        </div>
        <GhostBlock style={{ height: 15, width: '38%', borderRadius: 4 }} />
      </div>
    </div>
  )
}

/** List ghost card — matches ProductCard list layout */
export function GhostCardList() {
  return (
    <div className="flex gap-4 p-4 rounded-xl" style={{ background: 'var(--ghost-base)', border: '1px solid var(--border-subtle)' }}>
      <GhostBlock style={{ width: 72, height: 80, borderRadius: 8, flexShrink: 0 }} />
      <div className="flex-1 space-y-2 py-1">
        <GhostBlock style={{ height: 10, width: '40%', borderRadius: 4 }} />
        <GhostBlock style={{ height: 13, width: '78%', borderRadius: 4 }} />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <GhostBlock key={i} style={{ width: 10, height: 10, borderRadius: '50%' }} />
          ))}
        </div>
        <GhostBlock style={{ height: 15, width: '32%', borderRadius: 4 }} />
      </div>
    </div>
  )
}

/** Full-page product detail ghost */
export function GhostProductDetail() {
  return (
    <div className="pt-[68px] min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          {[60, 8, 80, 8, 120].map((w, i) =>
            i % 2 === 1
              ? <span key={i} className="text-muted/30">/</span>
              : <GhostBlock key={i} style={{ height: 11, width: w, borderRadius: 4 }} />
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <GhostBlock style={{ aspectRatio: '3/4', borderRadius: 16 }} />
          <div className="space-y-5 pt-2">
            <GhostBlock style={{ height: 11, width: '35%', borderRadius: 4 }} />
            <GhostBlock style={{ height: 42, width: '80%', borderRadius: 6 }} />
            <GhostBlock style={{ height: 34, width: '28%', borderRadius: 4 }} />
            <div className="space-y-2">
              {[100, 90, 72].map((w, i) => (
                <GhostBlock key={i} style={{ height: 11, width: `${w}%`, borderRadius: 4 }} />
              ))}
            </div>
            <div>
              <GhostBlock style={{ height: 10, width: '14%', marginBottom: 10, borderRadius: 4 }} />
              <div className="flex gap-2">
                {[1,2,3,4].map(i => <GhostBlock key={i} style={{ height: 38, width: 52, borderRadius: 10 }} />)}
              </div>
            </div>
            <div>
              <GhostBlock style={{ height: 10, width: '16%', marginBottom: 10, borderRadius: 4 }} />
              <div className="flex gap-2">
                {[1,2,3].map(i => <GhostBlock key={i} style={{ height: 38, width: 64, borderRadius: 10 }} />)}
              </div>
            </div>
            <GhostBlock style={{ height: 52, width: '100%', borderRadius: 12 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Ghost grid — n cards in a responsive grid */
export function GhostGrid({ count = 8, cols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }) {
  return (
    <div className={`grid ${cols} gap-4 sm:gap-6`}>
      {Array.from({ length: count }).map((_, i) => <GhostCard key={i} />)}
    </div>
  )
}

export default GhostCard
