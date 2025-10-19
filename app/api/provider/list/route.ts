import { NextResponse } from 'next/server'
import { cache } from '@/lib/cache'
import { getAggregatedStreams } from '@/lib/providers/aggregator'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const idStr = url.searchParams.get('id')
  const id = idStr ? parseInt(idStr, 10) : NaN
  if (!id || Number.isNaN(id)) return NextResponse.json({ sources: [] })

  const cacheKey = `prefetch-${id}`
  const cached = cache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.ts < 1000 * 60 * 5) {
    return NextResponse.json(cached.data)
  }

  try {
  const sources = await getAggregatedStreams(id)
    const data = { sources }
    cache.set(cacheKey, { ts: now, data })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ sources: [] })
  }
}
