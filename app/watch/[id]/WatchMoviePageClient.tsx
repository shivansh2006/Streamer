'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  movieId: string
  movie: {
    id: number
    title: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string
    vote_average: number
    runtime: number
    genres: { id: number; name: string }[]
  }
}

const EMBED_SERVERS = [
  { name: '(Primary)(English/Regional) ', url: (id: string) => `https://moviesapi.club/movie/${id}` },
  { name: 'Server 1 ', url: (id: string) => `https://vidsrc.to/embed/movie/${id}` },
  { name: 'Server 2 ', url: (id: string) => `https://vidsrc.xyz/embed/movie/${id}` },
 
]

export default function WatchMoviePageClient({ movieId, movie }: Props) {
  const [selectedServer, setSelectedServer] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const currentEmbedUrl = EMBED_SERVERS[selectedServer].url(movieId)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-[var(--text-secondary)]">
          <Link href={`/movie/${movieId}`} className="hover:text-[var(--accent)]">
            ← Back to {movie.title}
          </Link>
        </div>

        {/* Movie Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {movie.title} ({new Date(movie.release_date).getFullYear()})
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
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Movie Info */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
          <div className="flex gap-6">
            {movie.poster_path && (
              <div className="flex-shrink-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={150}
                  height={225}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
                  </span>
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  {movie.runtime && <span>{movie.runtime} min</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
