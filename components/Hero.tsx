"use client"
import Image from 'next/image'
import Link from 'next/link'

export function Hero({ movie }: { movie: { id: number; title: string; backdrop_path?: string | null; overview?: string; vote_average?: number } }) {
  return (
    <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8 h-[75vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      {movie.backdrop_path && (
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          quality={90}
        />
      )}
      
      {/* Multi-layer Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
              FEATURED
            </span>
            {movie.vote_average && (
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 drop-shadow-2xl">
            {movie.title}
          </h1>
          
          {/* Overview */}
          {movie.overview && (
            <p className="text-base sm:text-lg text-white/90 line-clamp-3 mb-6 drop-shadow-lg leading-relaxed">
              {movie.overview}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/watch/${movie.id}`}
              prefetch
              className="group flex items-center gap-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[var(--accent)]/50 transition-all hover:scale-105"
              onMouseEnter={() => {
                fetch(`/api/provider/prefetch?movieId=${movie.id}`).catch(() => {})
              }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play Now
            </Link>
            
            <Link
              href={`/movie/${movie.id}`}
              prefetch
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 hover:border-white/40 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </Link>
            
            <button className="flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/20 hover:border-white/40 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgb(14,14,16)] to-transparent pointer-events-none" />
    </section>
  )
}