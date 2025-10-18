import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

type TVShow = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  genres: { id: number; name: string }[]
  number_of_seasons: number
  number_of_episodes: number
  status: string
  tagline?: string
}

type Season = {
  id: number
  name: string
  season_number: number
  episode_count: number
  poster_path: string | null
  air_date: string
}

async function getTVShow(id: string): Promise<TVShow> {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch TV show')
  return res.json()
}

async function getSeasons(id: string): Promise<{ seasons: Season[] }> {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch seasons')
  return res.json()
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const show = await getTVShow(params.id)
    return {
      title: `${show.name} - Watch TV Series`,
      description: show.overview,
    }
  } catch {
    return { title: 'TV Show Not Found' }
  }
}

export default async function TVShowPage({ params }: { params: { id: string } }) {
  let show: TVShow
  try {
    show = await getTVShow(params.id)
  } catch {
    notFound()
  }

  const { seasons } = await getSeasons(params.id)
  const regularSeasons = seasons.filter(s => s.season_number > 0)

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      {show.backdrop_path && (
        <div className="relative h-[50vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {show.poster_path && (
            <div className="flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                width={300}
                height={450}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{show.name}</h1>
              {show.tagline && <p className="text-lg text-[var(--text-secondary)] italic">{show.tagline}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-white font-semibold">{show.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-[var(--text-secondary)]">{new Date(show.first_air_date).getFullYear()}</span>
              <span className="text-[var(--text-secondary)]">{show.status}</span>
              <span className="text-[var(--text-secondary)]">{show.number_of_seasons} Seasons</span>
              <span className="text-[var(--text-secondary)]">{show.number_of_episodes} Episodes</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {show.genres.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed">{show.overview}</p>
          </div>
        </div>

        {/* Seasons */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Seasons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {regularSeasons.map(season => (
              <Link
                key={season.id}
                href={`/tv/${params.id}/season/${season.season_number}`}
                className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:ring-2 hover:ring-[var(--accent)] transition-all duration-200 hover:scale-105"
              >
                {season.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                    alt={season.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[var(--text-secondary)]">S{season.season_number}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white font-semibold text-sm">{season.name}</h3>
                  <p className="text-[var(--text-secondary)] text-xs">{season.episode_count} Episodes</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
