import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

export default function ScrollVideoBackground() {
  const { theme } = useTheme()
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Only render in light mode
    if (theme !== 'light') return

    const video = videoRef.current
    if (!video) return

    // Preload video metadata
    const handleLoadedMetadata = () => {
      // Trigger initial scroll update
      handleScroll()
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0

      // Map scroll position (0-1) to video time (0 to duration)
      if (video.duration && !isNaN(video.duration)) {
        video.currentTime = scrollPercent * video.duration
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [theme])

  // Only render in light mode
  if (theme !== 'light') return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
    >
      <video
        ref={videoRef}
        src="/fabric-bg.mp4"
        className="w-full h-full object-cover"
        style={{ opacity: 0.25 }}
        muted
        playsInline
        preload="auto"
      />
    </div>
  )
}
