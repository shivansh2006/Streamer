'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PopupBlocker } from '@/components/PopupBlocker'

type Props = {
  tvId: string
  seasonNumber: string
  episodeNumber: string
  show: {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
  }
  episode: {
    id: number
    name: string
    overview: string
    still_path: string | null
    episode_number: number
    season_number: number
  }
}

const EMBED_SERVERS = [
  { name: 'Server 1 (Primary)', url: (id: string, s: string, e: string) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` },
  { name: 'Server 2 ', url: (id: string, s: string, e: string) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { name: 'Server 3 ', url: (id: string, s: string, e: string) => `https://moviesapi.club/tv/${id}-${s}-${e}` },
  { name: 'Server 4 ', url: (id: string, s: string, e: string) => `https://www.primewire.tf/embed/tv/${id}/${s}/${e}` },
]

export default function WatchTVPageClient({ tvId, seasonNumber, episodeNumber, show, episode }: Props) {
  const [selectedServer, setSelectedServer] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const currentEmbedUrl = EMBED_SERVERS[selectedServer].url(tvId, seasonNumber, episodeNumber)

  return (
    <>
      <PopupBlocker />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-[var(--text-secondary)]">
            <Link href={`/tv/${tvId}`} className="hover:text-[var(--accent)]">
              {show.name}
            </Link>
            {' '}/{' '}
            <Link href={`/tv/${tvId}/season/${seasonNumber}`} className="hover:text-[var(--accent)]">
              Season {seasonNumber}
          </Link>
          {' '}/{' '}
          <span className="text-white">Episode {episodeNumber}</span>
        </div>

        {/* Episode Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {episode.name}
        </h1>

        {/* Server Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Select Server:
          </label>
          <div className="flex flex-wrap gap-2">
            {EMBED_SERVERS.map((server, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedServer(index)
                  setIsLoading(true)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedServer === index
                    ? 'bg-[var(--accent)] text-white shadow-lg'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-8">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[var(--accent)] mx-auto mb-4"></div>
                <p className="text-white text-sm">Loading {EMBED_SERVERS[selectedServer].name}...</p>
              </div>
            </div>
          )}
          <iframe
            src={currentEmbedUrl}
            className="w-full h-full"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups-to-escape-sandbox"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay; fullscreen"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Episode Info */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
          <div className="flex gap-6">
            {episode.still_path && (
              <div className="flex-shrink-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                  alt={episode.name}
                  width={300}
                  height={169}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                Season {episode.season_number}, Episode {episode.episode_number}
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {episode.overview || 'No description available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          {parseInt(episodeNumber) > 1 && (
            <Link
              href={`/watch/tv/${tvId}/${seasonNumber}/${parseInt(episodeNumber) - 1}`}
              className="px-6 py-3 bg-[var(--bg-secondary)] text-white rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              ← Previous Episode
            </Link>
          )}
          <Link
            href={`/watch/tv/${tvId}/${seasonNumber}/${parseInt(episodeNumber) + 1}`}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity ml-auto"
          >
            Next Episode →
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
