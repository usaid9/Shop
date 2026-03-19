import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

export default function ScrollVideoBackground() {
  const { theme } = useTheme()
  const videoRef = useRef(null)

  useEffect(() => {
    // Only render in light mode
    if (theme !== 'light') return

    const video = videoRef.current
    if (!video) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0

      // Map scroll position (0-1) to video time (0 to duration)
      if (video.duration) {
        video.currentTime = scrollPercent * video.duration
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [theme])

  // Only render in light mode
  if (theme !== 'light') return null

  return (
    <video
      ref={videoRef}
      src="/Video Project.mp4"
      className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      style={{ opacity: 0.3 }}
      muted
      playsInline
    />
  )
}
