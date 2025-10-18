'use client'
import Hls from 'hls.js'
import { useEffect, useRef, useState } from 'react'

export default function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setError(null)
    setLoading(true)
    
    console.log('[VideoPlayer] Loading source:', src)

    let hls: Hls | null = null
    
    // Check if it's an HLS stream
    const isHLS = src.includes('.m3u8') || src.includes('m3u8')
    
    if (isHLS && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        xhrSetup: function(xhr) {
          // Add CORS headers for cross-origin requests
          xhr.withCredentials = false
        }
      })
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('[VideoPlayer] Manifest parsed, attempting autoplay')
        setLoading(false)
        video.play().catch(e => {
          console.warn('[VideoPlayer] Autoplay prevented:', e)
          setError('Click to play')
        })
      })
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[VideoPlayer] HLS error:', data)
        if (data.fatal) {
          setLoading(false)
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error - Stream may be blocked by CORS or unavailable')
              hls?.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error - Trying to recover...')
              hls?.recoverMediaError()
              break
            default:
              setError('Fatal error - Cannot play this stream')
              hls?.destroy()
              break
          }
        }
      })
      
      hls.loadSource(src)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        console.log('[VideoPlayer] Metadata loaded (native)')
        setLoading(false)
        video.play().catch(e => {
          console.warn('[VideoPlayer] Autoplay prevented:', e)
          setError('Click to play')
        })
      })
      video.addEventListener('error', (e) => {
        console.error('[VideoPlayer] Native video error:', e)
        setLoading(false)
        setError('Cannot play this stream - Try another source')
      })
    } else {
      // Direct MP4 or other format
      video.src = src
      video.addEventListener('loadeddata', () => {
        console.log('[VideoPlayer] Data loaded')
        setLoading(false)
        video.play().catch(e => {
          console.warn('[VideoPlayer] Autoplay prevented:', e)
          setError('Click to play')
        })
      })
      video.addEventListener('error', (e) => {
        console.error('[VideoPlayer] Video error:', e)
        setLoading(false)
        setError('Cannot play this stream - Try another source')
      })
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [src])

  return (
    <div className="relative">
      <video 
        ref={videoRef} 
        className="w-full aspect-video bg-black" 
        controls 
        playsInline 
        poster={poster}
        crossOrigin="anonymous"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[var(--accent)] mx-auto mb-2"></div>
            <p className="text-white text-sm">Loading stream...</p>
          </div>
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-none">
          <div className="text-center px-4">
            <div className="text-red-400 text-lg mb-2">⚠ {error}</div>
            {error.includes('CORS') && (
              <p className="text-white/60 text-sm">This stream is blocked. Try another source from the dropdown above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}