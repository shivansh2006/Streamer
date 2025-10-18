import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WatchTVPageClient from './WatchTVPageClient'

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

type TVShow = {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

type Episode = {
  id: number
  name: string
  overview: string
  still_path: string | null
  episode_number: number
  season_number: number
}

async function getTVShow(id: string): Promise<TVShow> {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch TV show')
  return res.json()
}

async function getEpisode(tvId: string, season: string, episode: string): Promise<Episode> {
  const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${season}/episode/${episode}?api_key=${API_KEY}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch episode')
  return res.json()
}

export async function generateMetadata({ params }: { params: { id: string; season: string; episode: string } }): Promise<Metadata> {
  try {
    const [show, episode] = await Promise.all([
      getTVShow(params.id),
      getEpisode(params.id, params.season, params.episode)
    ])
    return {
      title: `${show.name} S${params.season}E${params.episode} - ${episode.name}`,
      description: episode.overview,
    }
  } catch {
    return { title: 'Episode Not Found' }
  }
}

export default async function WatchTVPage({ params }: { params: { id: string; season: string; episode: string } }) {
  let show: TVShow
  let episode: Episode
  
  try {
    [show, episode] = await Promise.all([
      getTVShow(params.id),
      getEpisode(params.id, params.season, params.episode)
    ])
  } catch {
    notFound()
  }

  return (
    <WatchTVPageClient 
      tvId={params.id}
      seasonNumber={params.season}
      episodeNumber={params.episode}
      show={show}
      episode={episode}
    />
  )
}
