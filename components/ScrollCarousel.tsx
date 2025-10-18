import Image from 'next/image'
import Link from 'next/link'

type Movie = { id: number; title: string; poster_path: string | null }

export function ScrollCarousel({ title, items }: { title: string; items: Movie[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none]">
          {items.map((m) => (
            <Link key={m.id} href={`/movie/${m.id}`} className="group min-w-[140px] max-w-[140px]">
              <div className="relative aspect-[2/3] overflow-hidden rounded bg-white/5">
                {m.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    alt={m.title}
                    fill
                    sizes="140px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-white/50">No Image</div>
                )}
              </div>
              <div className="mt-2 line-clamp-2 text-sm text-white/90">{m.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}