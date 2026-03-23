import React from 'react'
import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * ScrollFloat — reactbits-style scroll-driven word float animation.
 * Each word lifts into place as the element scrolls into the viewport.
 */
function Word({ word, progress, index, total, isAccent }) {
  const start = index / (total + 1)
  const end = (index + 1) / (total + 1)

  const y = useTransform(progress, [start, end], ['1.2em', '0em'])
  const opacity = useTransform(progress, [start, start + (end - start) * 0.6], [0, 1])

  return (
    <span className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom' }}>
      <motion.span
        className={`inline-block ${isAccent ? 'text-accent italic' : ''}`}
        style={{ y, opacity, willChange: 'transform, opacity' }}
      >
        {word}
      </motion.span>
    </span>
  )
}

export default function ScrollFloat({
  children,
  className = '',
  accentWords = [],          // words to colour in accent red
  scrollOffset = ['start 90%', 'start 30%'],
}) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollOffset,
  })

  // Split children string into tokens; keep spaces
  const words = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split(/(\s+)/).filter(Boolean)
  }, [children])

  const textWords = useMemo(() => words.filter(w => w.trim().length > 0), [words])

  return (
    <span ref={containerRef} className={`inline ${className}`}>
      {words.map((token, i) => {
        if (!token.trim()) {
          // Preserve spaces
          return <span key={i}>&nbsp;</span>
        }
        const wordIndex = textWords.indexOf(token)
        const isAccent = accentWords.includes(token)
        return (
          <Word
            key={i}
            word={token}
            progress={scrollYProgress}
            index={wordIndex}
            total={textWords.length}
            isAccent={isAccent}
          />
        )
      })}
    </span>
  )
}
