import Image from 'next/image'
import Link from 'next/link'
import { getMovieFull, getSimilarMovies } from '@/lib/tmdb'
import { Stars } from '@/components/ui/Stars'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { Tabs } from '@/components/ui/Tabs'

export default async function MoviePage({ params }: { params: { id: string } }) {
  const [movie, similar] = await Promise.all([
    getMovieFull(params.id),
    getSimilarMovies(params.id)
  ])
  const year = movie.release_date?.slice(0, 4)
  const genres = movie.genres?.map((g) => g.name).join(' • ')
  const certification = (() => {
    const list = (movie as any)?.release_dates?.results as any[] | undefined
    const inCountry = list?.find((r) => r.iso_3166_1 === 'IN') || list?.[0]
    const cert = inCountry?.release_dates?.find((d: any) => d.certification)?.certification
    return cert || 'NR'
  })()
  const keywords = (movie as any)?.keywords?.keywords || (movie as any)?.keywords?.results || []
  return (
    <div>
      {movie.backdrop_path && (
        <div className="relative -mx-4 mb-6 h-72 overflow-hidden md:h-96">
          <Image src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt={movie.title} fill className="object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-white/5">
          {movie.poster_path && (
            <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} fill className="object-cover" />
          )}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{movie.title}</h1>
          <p className="mt-3 max-w-3xl text-white/85 text-lg leading-relaxed">{movie.overview}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>NEW MOVIE</Badge>
            <Badge>IMDb {(movie.vote_average ?? 0).toFixed(1)}</Badge>
            {typeof movie.runtime === 'number' && <Badge>{Math.round(movie.runtime)} min</Badge>}
            {year && <Badge>{year}</Badge>}
            {/* Example badges like HDR/UHD mimic */}
            <Badge>HDR</Badge>
            <Badge>UHD</Badge>
          </div>
          <div className="mt-3 text-sm text-white/70">{genres}</div>
          <div className="mt-2"><Stars value={movie.vote_average ?? 0} /></div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link 
              href={`/watch/${movie.id}`} 
              className="rounded-lg bg-[var(--accent)] px-8 py-3 font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>▶</span> Watch Now
            </Link>
            <button className="rounded-lg bg-white/10 hover:bg-white/20 px-6 py-3 transition">+ Watchlist</button>
            <IconButton label="Like">👍</IconButton>
            <IconButton label="Share">↗</IconButton>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
            <Tabs
              tabs={[
                {
                  label: 'Details',
                  content: (
                    <div className="grid grid-cols-2 gap-2 text-sm text-white/80 max-w-2xl">
                      <div><span className="text-white/60">Release Date:</span> {movie.release_date}</div>
                      <div><span className="text-white/60">Status:</span> {movie.status}</div>
                      <div><span className="text-white/60">Original Title:</span> {movie.original_title}</div>
                      <div><span className="text-white/60">Runtime:</span> {movie.runtime ? `${movie.runtime} min` : 'N/A'}</div>
                      <div><span className="text-white/60">Budget:</span> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</div>
                      <div><span className="text-white/60">Revenue:</span> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</div>
                      <div><span className="text-white/60">Language:</span> {movie.original_language?.toUpperCase()}</div>
                      <div><span className="text-white/60">Production Companies:</span> {movie.production_companies?.map((c: any) => c.name).join(', ') || 'N/A'}</div>
                      <div><span className="text-white/60">Genres:</span> {genres}</div>
                      <div><span className="text-white/60">IMDb:</span> {(movie.vote_average ?? 0).toFixed(1)} / 10</div>
                      <div><span className="text-white/60">Certification:</span> {certification}</div>
                      <div className="col-span-2 flex flex-wrap gap-2 pt-1">
                        {keywords.slice(0, 8).map((k: any) => (
                          <Badge key={k.id}>{k.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  label: 'Related',
                  content: (
                    <div>
                      {similar?.results?.length ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {similar.results.slice(0, 10).map((m) => (
                            <Link key={m.id} href={`/movie/${m.id}`} className="group">
                              <div className="relative aspect-[2/3] overflow-hidden rounded bg-white/5">
                                {m.poster_path ? (
                                  <Image src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                ) : (
                                  <div className="grid h-full w-full place-items-center text-white/50">No Image</div>
                                )}
                              </div>
                              <div className="mt-2 line-clamp-2 text-sm text-white/90">{m.title}</div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-white/60">No related titles.</div>
                      )}
                    </div>
                  )
                },
                {
                  label: 'Details',
                  content: (
                    <div className="grid grid-cols-2 gap-2 text-sm text-white/80 max-w-2xl">
                      <div><span className="text-white/60">Title:</span> {movie.title}</div>
                      <div><span className="text-white/60">Year:</span> {year}</div>
                      <div><span className="text-white/60">Runtime:</span> {Math.round(movie.runtime ?? 0)} min</div>
                      <div><span className="text-white/60">Votes:</span> {movie.vote_count}</div>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Related moved inside Tabs */}
    </div>
  )
}