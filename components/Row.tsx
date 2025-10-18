"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

type Movie = { id: number; title: string; poster_path: string | null; vote_average?: number }

export function Row({ title, items, large = false }: { title: string; items: Movie[]; large?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="group/row mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((m) => (
          <Link 
            key={m.id} 
            href={`/movie/${m.id}`} 
            className="group relative flex-shrink-0 snap-start"
          >
            <div className={`relative ${large ? 'h-[280px] w-[190px]' : 'h-[240px] w-[160px]'} overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[var(--accent)]/20`}>
              {m.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/${large ? 'w500' : 'w342'}${m.poster_path}`}
                  alt={m.title}
                  fill
                  sizes={large ? '190px' : '160px'}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-white/50">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-bold line-clamp-2 mb-2">{m.title}</h3>
                  {m.vote_average && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold">{m.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  <button className="mt-3 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Play
                  </button>
                </div>
              </div>
              
              {/* Rating Badge */}
              {m.vote_average && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span>{m.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}