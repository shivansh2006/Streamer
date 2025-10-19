const TMDB_BASE = 'https://api.themoviedb.org/3'

export type TmdbMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  vote_average?: number
  vote_count?: number
  runtime?: number
  genres?: { id: number; name: string }[]
  // additional fields used in pages
  status?: string
  original_title?: string
  budget?: number
  revenue?: number
  original_language?: string
  production_companies?: { id: number; name: string }[]
}

async function tmdbFetch<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
  const params = new URLSearchParams()
  params.set('language', 'en-US')
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v))
    })
  }

  const apiKey = process.env.TMDB_API_KEY
  const bearer = process.env.TMDB_BEARER
  if (apiKey) params.set('api_key', apiKey)

  const url = `${TMDB_BASE}${path}?${params.toString()}`
  let lastErr: any
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined
      })
      if (!res.ok) throw new Error(`TMDB error ${res.status}`)
      return res.json() as Promise<T>
    } catch (e) {
      lastErr = e
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)))
    }
  }
  throw new Error(`Failed to fetch TMDB ${path}: ${lastErr?.message || lastErr}`)
}

export async function searchMovies(query: string) {
  try {
    return await tmdbFetch<{ results: TmdbMovie[] }>('/search/movie', { query })
  } catch {
    return { results: [] }
  }
}

export async function getPopularMovies() {
  try {
    return await tmdbFetch<{ results: TmdbMovie[] }>('/movie/popular')
  } catch {
    return { results: [] }
  }
}

export async function getTrendingMovies() {
  try {
    return await tmdbFetch<{ results: TmdbMovie[] }>(`/trending/movie/week`)
  } catch {
    return { results: [] }
  }
}

export async function getMovie(id: string | number) {
  try {
    return await tmdbFetch<TmdbMovie>(`/movie/${id}`)
  } catch {
    return { id: Number(id), title: 'Unknown', overview: '', poster_path: null, backdrop_path: null } as TmdbMovie
  }
}

export async function getMovieFull(id: string | number) {
  // append extra fields for a richer movie page
  try {
    return await tmdbFetch<TmdbMovie & { videos: any; credits: any; keywords: any; release_dates: any }>(`/movie/${id}`, {
      append_to_response: 'videos,credits,keywords,release_dates'
    })
  } catch {
    return { id: Number(id), title: 'Unknown', overview: '', poster_path: null, backdrop_path: null } as TmdbMovie
  }
}

export async function getSimilarMovies(id: string | number) {
  try {
    return await tmdbFetch<{ results: TmdbMovie[] }>(`/movie/${id}/similar`)
  } catch {
    return { results: [] }
  }
}

export async function getTrendingIndia() {
  // Use discover with region=IN and sort by popularity
  try {
    return await tmdbFetch<{ results: TmdbMovie[] }>(`/discover/movie`, {
      region: 'IN',
      sort_by: 'popularity.desc'
    })
  } catch {
    return { results: [] }
  }
}

export async function getTopRatedMovies() {
  try {
    return await tmdbFetch<{ results: TmdbMovie[] }>(`/movie/top_rated`)
  } catch {
    return { results: [] }
  }
}

export async function getNowPlayingMovies() {
  try {
    return await tmdbFetch<{ results: TmdbMovie[] }>(`/movie/now_playing`)
  } catch {
    return { results: [] }
  }
}

export async function getHorrorMovies() {
  try {
    // Genre ID 27 is Horror
    return await tmdbFetch<{ results: TmdbMovie[] }>(`/discover/movie`, {
      with_genres: 27,
      sort_by: 'popularity.desc'
    })
  } catch {
    return { results: [] }
  }
}

// TV SHOWS
export type TmdbTVShow = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date?: string
  vote_average?: number
}

export async function getPopularTVShows() {
  try {
    return await tmdbFetch<{ results: TmdbTVShow[] }>('/tv/popular')
  } catch {
    return { results: [] }
  }
}

export async function getTrendingTVShows() {
  try {
    return await tmdbFetch<{ results: TmdbTVShow[] }>(`/trending/tv/week`)
  } catch {
    return { results: [] }
  }
}

export async function getTopRatedTVShows() {
  try {
    return await tmdbFetch<{ results: TmdbTVShow[] }>(`/tv/top_rated`)
  } catch {
    return { results: [] }
  }
}

export async function searchTVShows(query: string) {
  try {
    return await tmdbFetch<{ results: TmdbTVShow[] }>('/search/tv', { query })
  } catch {
    return { results: [] }
  }
}

export async function getTrendingAnime() {
  // Genre ID 16 is Animation, filter by TV shows
  try {
    return await tmdbFetch<{ results: TmdbTVShow[] }>(`/discover/tv`, {
      with_genres: 16,
      sort_by: 'popularity.desc',
      with_original_language: 'ja'
    })
  } catch {
    return { results: [] }
  }
}

export function tmdbImage(path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500') {
  if (!path) return undefined
  return `https://image.tmdb.org/t/p/${size}${path}`
}
