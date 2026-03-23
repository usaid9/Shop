import React from 'react'
// Minimal line-art SVG icons for each category
export default function CategoryIcon({ id, className = 'w-7 h-7' }) {
  const icons = {
    all: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    shirts: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7 3L3 7l3 2v10a1 1 0 001 1h10a1 1 0 001-1V9l3-2-4-4c0 0-1.5 2-4 2S7 3 7 3z" />
      </svg>
    ),
    trousers: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M5 3h14l-2 10-3 8H10L7 13 5 3z" />
        <line x1="12" y1="3" x2="12" y2="13" />
      </svg>
    ),
    jackets: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7 3L3 7l2 1v11a1 1 0 001 1h12a1 1 0 001-1V8l2-1-4-4-2 2a4 4 0 01-6 0L7 3z" />
        <path strokeLinecap="round" d="M12 5v14" />
      </svg>
    ),
    shoes: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 17c0 0 2-5 5-7l2-1 6 1 4 2v2a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
        <path strokeLinecap="round" d="M8 10l1-5h4l1 5" />
      </svg>
    ),
    watches: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <path strokeLinecap="round" d="M12 9.5V12l2 1.5" />
        <path strokeLinecap="round" d="M9 4.5L10.5 7M15 4.5L13.5 7M9 19.5L10.5 17M15 19.5L13.5 17" />
        <line x1="7" y1="4" x2="9" y2="7" />
        <line x1="17" y1="4" x2="15" y2="7" />
        <line x1="7" y1="20" x2="9" y2="17" />
        <line x1="17" y1="20" x2="15" y2="17" />
      </svg>
    ),
    accessories: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 10.5A3.5 3.5 0 006.5 14a3.5 3.5 0 003.5-3.5 3.5 3.5 0 003.5 3.5A3.5 3.5 0 0017 10.5M3 10.5A3.5 3.5 0 016.5 7M17 10.5A3.5 3.5 0 0117 7M6.5 7h4M13.5 7H17M17 7a4 4 0 014 3.5" />
      </svg>
    ),
    kurta: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7 3L3 7l3 2v10a1 1 0 001 1h10a1 1 0 001-1V9l3-2L17 3c0 0-1 2-5 2S7 3 7 3z" />
        <path strokeLinecap="round" d="M12 5v6M10 8h4" />
      </svg>
    ),
  }

  return icons[id] || icons.all
}
