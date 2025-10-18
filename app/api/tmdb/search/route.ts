import { NextResponse } from 'next/server'

const TMDB_BASE = 'https://api.themoviedb.org/3'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') ?? ''
  const apiKey = process.env.TMDB_API_KEY || ''
  const url = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US&api_key=${apiKey}`
  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json()
  return NextResponse.json(data)
}