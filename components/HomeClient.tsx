'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Row } from '@/components/Row'

type Movie = { 
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path?: string | null
  vote_average?: number
}

type RowMovie = {
  id: number
  title: string
  poster_path: string | null
  vote_average?: number
}

type Props = {
  q?: string
  trendingGlobal: Movie[]
  trendingIndia: Movie[]
  horror: Movie[]
  trendingAnime: Movie[]
  searchResults: {
    movies: Movie[]
    tv: Movie[]
  }
}

export function HomeClient({ q, trendingGlobal, trendingIndia, horror, trendingAnime, searchResults }: Props) {
  const [heroIndex, setHeroIndex] = useState<number>(0)

  useEffect(() => {
    if (!q && trendingGlobal.length > 1) {
      const interval = setInterval(() => {
        setHeroIndex((i: number) => (i + 1) % trendingGlobal.length)
      }, 3500)
      return () => clearInterval(interval)
    }
  }, [q, trendingGlobal.length])

  // Helper to convert Movie to RowMovie
  const toRowMovie = (m: Movie): RowMovie => ({
    id: m.id,
    title: m.title || m.name || 'Untitled',
    poster_path: m.poster_path,
    vote_average: m.vote_average
  })

  return (
    <div className="space-y-0">
      {(!q && trendingGlobal.length > 0) && <Hero movie={{
        id: trendingGlobal[heroIndex].id,
        title: trendingGlobal[heroIndex].title || trendingGlobal[heroIndex].name || 'Movie',
        backdrop_path: trendingGlobal[heroIndex].backdrop_path,
        overview: trendingGlobal[heroIndex].overview,
        vote_average: trendingGlobal[heroIndex].vote_average
      }} />}
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {q ? (
          <div className="space-y-10">
            <Section title={`Movies matching "${q}"`} movies={searchResults.movies} type="movie" />
            <Section title={`TV Shows matching "${q}"`} movies={searchResults.tv} type="tv" />
          </div>
        ) : (
          <>
            {trendingIndia.length ? <Row title="🔥 Top Trending In India ⭐" items={trendingIndia.map(toRowMovie)} large /> : null}
            {trendingGlobal.length ? <Row title="🌎 Trending Worldwide" items={trendingGlobal.map(toRowMovie)} /> : null}
            {horror.length ? <Row title="� Horror Movies" items={horror.map(toRowMovie)} /> : null}
            {trendingAnime.length ? <Row title="✨ Top Trending Anime" items={trendingAnime.map(toRowMovie)} /> : null}
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, movies, type }: { title: string; movies: Movie[]; type: 'movie' | 'tv' }) {
  if (!movies.length) {
    return (
      <section className="py-12">
        <h2 className="mb-6 text-2xl font-bold">{title}</h2>
        <div className="text-center py-12 text-white/40">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">No results found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.slice(0, 18).map((m) => (
          <Link key={m.id} href={type === 'movie' ? `/movie/${m.id}` : `/tv/${m.id}`} className="group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[var(--accent)]/20">
              {m.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                  alt={type === 'movie' ? (m.title || m.name || 'Movie') : (m.name || m.title || 'Show')}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-white/30">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-xs text-white font-semibold line-clamp-2 mb-2">{type === 'movie' ? m.title : m.name}</div>
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Play
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 line-clamp-2 text-sm text-white/60 group-hover:text-white transition">{type === 'movie' ? m.title : m.name}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
