import { NextResponse } from 'next/server'

const TMDB_BASE = 'https://api.themoviedb.org/3'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const apiKey = process.env.TMDB_API_KEY || ''
  const res = await fetch(`${TMDB_BASE}/movie/${params.id}?language=en-US&api_key=${apiKey}`, { cache: 'no-store' })
  const data = await res.json()
  return NextResponse.json(data)
}