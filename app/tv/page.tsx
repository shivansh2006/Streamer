import Image from 'next/image'
import Link from 'next/link'
import { getPopularTVShows, getTrendingTVShows, getTopRatedTVShows, searchTVShows } from '@/lib/tmdb'
import { Hero } from '@/components/Hero'
import { Row } from '@/components/Row'

type TVShow = { id: number; name: string; overview: string; poster_path: string | null }

async function getPopular() {
  return getPopularTVShows()
}
async function getTrending() {
  return getTrendingTVShows()
}
async function search(q: string) {
  return searchTVShows(q)
}

export default async function TVPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q?.trim()
  const [popular, trending, topRated, searchResults] = await Promise.all([
    getPopular(),
    getTrending(),
    getTopRatedTVShows(),
    q ? search(q) : Promise.resolve({ results: [] as TVShow[] })
  ])
  
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      {(!q && trending.results?.[0]) && (
        <div className="relative h-[60vh] w-full">
          {trending.results[0].backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${trending.results[0].backdrop_path}`}
              alt={trending.results[0].name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">{trending.results[0].name}</h1>
            <p className="text-lg text-white/90 max-w-3xl line-clamp-3">{trending.results[0].overview}</p>
            <Link
              href={`/tv/${trending.results[0].id}`}
              className="inline-block px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View Series
            </Link>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {q ? (
          <Section title={`Search Results for "${q}"`} shows={searchResults.results} />
        ) : (
          <>
            {trending.results?.length ? <TVRow title="🔥 Trending TV Shows" items={trending.results} large /> : null}
            {popular.results?.length ? <TVRow title="📺 Popular Series" items={popular.results} /> : null}
            {topRated.results?.length ? <TVRow title="⭐ Top Rated Shows" items={topRated.results} /> : null}
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, shows }: { title: string; shows: TVShow[] }) {
  if (!shows.length) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">No TV shows found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map(show => (
          <Link key={show.id} href={`/tv/${show.id}`} className="group">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
              {show.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">📺</div>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-white line-clamp-2 group-hover:text-[var(--accent)]">
              {show.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

function TVRow({ title, items, large }: { title: string; items: TVShow[]; large?: boolean }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map(show => (
          <Link
            key={show.id}
            href={`/tv/${show.id}`}
            className="flex-shrink-0 group"
            style={{ width: large ? '300px' : '200px' }}
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
              {show.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">📺</div>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-white line-clamp-2 group-hover:text-[var(--accent)]">
              {show.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
