import Image from 'next/image'
import Link from 'next/link'
import { getPopularMovies, getTrendingMovies, getTrendingIndia, getTopRatedMovies, getNowPlayingMovies, getHorrorMovies, getTrendingAnime, searchMovies, searchTVShows } from '@/lib/tmdb'
import { HomeClient } from '@/components/HomeClient'

type Movie = { id: number; title: string; overview: string; poster_path: string | null }

async function getPopular() {
  return getPopularMovies()
}
async function getTrending() {
  return getTrendingMovies()
}

async function searchAll(q: string) {
  const [movies, tv] = await Promise.all([
    searchMovies(q),
    searchTVShows(q)
  ])
  return { movies: movies.results, tv: tv.results }
}


export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q?.trim()
  const [popular, trendingGlobal, trendingIndia, topRated, nowPlaying, horror, trendingAnime, searchResults] = await Promise.all([
    getPopular(),
    getTrending(),
    getTrendingIndia(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getHorrorMovies(),
    getTrendingAnime(),
    q ? searchAll(q) : Promise.resolve({ movies: [], tv: [] })
  ])

  return (
    <HomeClient
      q={q}
      trendingGlobal={trendingGlobal.results || []}
      trendingIndia={trendingIndia.results || []}
      horror={horror.results || []}
      trendingAnime={trendingAnime.results || []}
      searchResults={searchResults}
    />
  )
}