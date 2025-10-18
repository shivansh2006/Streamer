import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

type Episode = {
  id: number
  name: string
  overview: string
  still_path: string | null
  episode_number: number
  season_number: number
  air_date: string
  vote_average: number
  runtime: number
}

type SeasonDetails = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  episodes: Episode[]
}

type TVShow = {
  id: number
  name: string
  poster_path: string | null
}

async function getSeasonDetails(tvId: string, seasonNumber: string): Promise<SeasonDetails> {
  const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch season')
  return res.json()
}

async function getTVShow(id: string): Promise<TVShow> {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch TV show')
  return res.json()
}

export async function generateMetadata({ params }: { params: { id: string; season: string } }): Promise<Metadata> {
  try {
    const [show, season] = await Promise.all([
      getTVShow(params.id),
      getSeasonDetails(params.id, params.season)
    ])
    return {
      title: `${show.name} - ${season.name}`,
      description: season.overview,
    }
  } catch {
    return { title: 'Season Not Found' }
  }
}

export default async function SeasonPage({ params }: { params: { id: string; season: string } }) {
  let season: SeasonDetails
  let show: TVShow
  
  try {
    [season, show] = await Promise.all([
      getSeasonDetails(params.id, params.season),
      getTVShow(params.id)
    ])
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-[var(--text-secondary)]">
          <Link href={`/tv/${params.id}`} className="hover:text-[var(--accent)]">
            ← Back to {show.name}
          </Link>
        </div>

        {/* Season Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {season.poster_path && (
            <div className="flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                alt={season.name}
                width={200}
                height={300}
                className="rounded-lg shadow-xl"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{show.name}</h1>
            <h2 className="text-xl md:text-2xl text-[var(--accent)] mb-4">{season.name}</h2>
            {season.overview && <p className="text-[var(--text-secondary)] leading-relaxed">{season.overview}</p>}
          </div>
        </div>

        {/* Episodes List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Episodes ({season.episodes.length})</h3>
          {season.episodes.map(episode => (
            <Link
              key={episode.id}
              href={`/watch/tv/${params.id}/${params.season}/${episode.episode_number}`}
              className="block group"
            >
              <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden hover:ring-2 hover:ring-[var(--accent)] transition-all duration-200 hover:scale-[1.01]">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Episode Thumbnail */}
                  <div className="relative flex-shrink-0 w-full sm:w-64 aspect-video rounded overflow-hidden bg-[var(--bg-tertiary)]">
                    {episode.still_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl text-[var(--text-secondary)]">📺</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xl">▶</span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-sm font-bold text-white">
                      EP {episode.episode_number}
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="text-lg font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
                        {episode.episode_number}. {episode.name}
                      </h4>
                      {episode.vote_average > 0 && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white text-sm font-semibold">{episode.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mb-2">
                      {episode.air_date && <span>{new Date(episode.air_date).toLocaleDateString()}</span>}
                      {episode.runtime && <span>{episode.runtime} min</span>}
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                      {episode.overview || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
