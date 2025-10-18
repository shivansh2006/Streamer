import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WatchMoviePageClient from './WatchMoviePageClient'

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

type Movie = {
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

async function getMovie(id: string): Promise<Movie> {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch movie')
  return res.json()
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const movie = await getMovie(params.id)
    return {
      title: `Watch ${movie.title} (${new Date(movie.release_date).getFullYear()})`,
      description: movie.overview,
    }
  } catch {
    return { title: 'Movie Not Found' }
  }
}

export default async function WatchPage({ params }: { params: { id: string } }) {
  let movie: Movie
  
  try {
    movie = await getMovie(params.id)
  } catch {
    notFound()
  }

  return <WatchMoviePageClient movieId={params.id} movie={movie} />
}