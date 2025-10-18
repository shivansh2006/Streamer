import { NextResponse } from 'next/server'
import { cache } from '@/lib/cache'
import { getAggregatedStreams } from '@/lib/providers/utils'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ sources: [] })

  const cacheKey = `prefetch-${id}`
  const cached = cache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.ts < 1000 * 60 * 5) {
    return NextResponse.json(cached.data)
  }

  try {
    const sources = await getAggregatedStreams(id) // id is a string
    const data = { sources }
    cache.set(cacheKey, { ts: now, data })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ sources: [] })
  }
}
