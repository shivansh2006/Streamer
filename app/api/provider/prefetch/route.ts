import { NextResponse } from 'next/server'
import { getAggregatedStreams } from '@/lib/providers/aggregator'

const cache = new Map<string, { ts: number; data: any }>()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const idStr = searchParams.get('movieId')
  const id = idStr ? parseInt(idStr, 10) : NaN
  if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'movieId is required' }, { status: 400 })

  const key = String(id)
  const hit = cache.get(key)
  const now = Date.now()
  if (hit && now - hit.ts < 60_000) return NextResponse.json(hit.data)

  try {
    const sources = await getAggregatedStreams(id)
    const data = { sources }
    cache.set(key, { ts: now, data })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ sources: [] })
  }
}