"use client"
import VideoPlayer from '@/components/VideoPlayer'
import { useEffect, useState, useRef } from 'react'

type StreamSource = { url: string; quality: string; provider: string }

export default function WatchPageClient({ movieId }: { movieId: number }) {
  const [sources, setSources] = useState<StreamSource[]>([])
  const [selected, setSelected] = useState<StreamSource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enabled, setEnabled] = useState<Record<string, boolean>>({})
  const [streamCount, setStreamCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const hasAutoSelected = useRef(false)

  // Load preferences
  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('nf:prefs') || '{}')
      setEnabled(prefs.enabledProviders || {})
    } catch {}
  }, [])

  // Fetch streams progressively with SSE - play first stream INSTANTLY
  useEffect(() => {
    const controller = new AbortController()
    let localSources: StreamSource[] = []

    const fetchStreamsSSE = async () => {
      try {
        setLoading(true)
        setError(null)
        hasAutoSelected.current = false

        const res = await fetch(`/api/provider/stream-sse?movieId=${movieId}`, {
          signal: controller.signal
        })

        if (!res.ok) throw new Error('Failed to fetch streams')
        if (!res.body) throw new Error('No response body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.type === 'stream') {
                  const stream = data.data as StreamSource
                  
                  // Check if provider is enabled
                  const isEnabled = Object.keys(enabled).length === 0 || enabled[stream.provider] !== false
                  
                  if (isEnabled) {
                    localSources.push(stream)
                    setSources([...localSources])
                    setStreamCount(localSources.length)

                    // AUTO-PLAY FIRST STREAM INSTANTLY!
                    if (!hasAutoSelected.current && localSources.length === 1) {
                      setSelected(stream)
                      setLoading(false)
                      hasAutoSelected.current = true
                    }
                  }
                } else if (data.type === 'complete') {
                  setIsComplete(true)
                  if (localSources.length === 0) {
                    setError('No streams available from enabled providers')
                  }
                  setLoading(false)
                } else if (data.type === 'error') {
                  setError(data.message || 'Failed to fetch streams')
                  setLoading(false)
                }
              } catch (parseErr) {
                console.warn('Failed to parse SSE data:', parseErr)
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Failed to load streams. Please try again.')
          setLoading(false)
        }
      }
    }

    fetchStreamsSSE()

    return () => {
      controller.abort()
    }
  }, [movieId, enabled])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--accent)]"></div>
        <p className="text-white/70 text-lg">
          {streamCount > 0 ? `Found ${streamCount} stream${streamCount > 1 ? 's' : ''}...` : 'Loading streams...'}
        </p>
        <p className="text-white/50 text-sm">First stream will play automatically</p>
      </div>
    )
  }

  if (error || !selected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-red-400 text-xl">⚠ {error || 'No streams available'}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Professional Header with Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold">Now Playing</h2>
        
        {/* Stream Source Dropdown */}
        <div className="relative">
          <label className="block text-sm text-white/60 mb-2">Select Source</label>
          <select
            value={selected.url}
            onChange={(e) => {
              const newSource = sources.find(s => s.url === e.target.value)
              if (newSource) setSelected(newSource)
            }}
            className="w-full sm:w-64 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-white/15 focus:bg-white/15 focus:border-[var(--accent)] focus:outline-none transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            {sources.map((source, idx) => (
              <option key={idx} value={source.url}>
                {source.quality} - {source.provider}
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-white/40">
            {sources.length} source{sources.length !== 1 ? 's' : ''} available
            {!isComplete && <span className="ml-2 text-[var(--accent)]">(loading more...)</span>}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl">
        <VideoPlayer src={selected.url} />
      </div>

      {/* Stream Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 mb-1">Quality</div>
          <div className="text-white font-semibold text-lg">{selected.quality}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 mb-1">Provider</div>
          <div className="text-white font-semibold text-lg">{selected.provider}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 col-span-2 md:col-span-1">
          <div className="text-white/60 mb-1">Status</div>
          <div className="text-green-400 font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Streaming
          </div>
        </div>
      </div>

      {/* Debug Info (toggle-able) */}
      <details className="bg-black/40 rounded-lg p-4 border border-white/10">
        <summary className="cursor-pointer text-sm text-white/60 hover:text-white transition">
          🔧 Debug Information
        </summary>
        <div className="mt-3 space-y-2 text-xs font-mono break-all text-white/80">
          <div><strong>URL:</strong> {selected.url}</div>
          <div><strong>Provider:</strong> {selected.provider}</div>
          <div><strong>Quality:</strong> {selected.quality}</div>
          <div><strong>Total Sources:</strong> {sources.length}</div>
        </div>
      </details>
    </div>
  )
}
