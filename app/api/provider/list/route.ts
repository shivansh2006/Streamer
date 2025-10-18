import { NextResponse } from 'next/server'
import { getAggregatedStreams } from '@/lib/providers/aggregator'
import { cache } from '@/lib/cache'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const idParam = url.searchParams.get('id')

  if (!idParam) {
    return NextResponse.json({ sources: [] })
  }

  // Convert id to string if it's not
  const id = String(idParam)
  const key = `prefetch:${id}`
  const now = Date.now()

  try {
    // Check cache first
    const cached = cache.get(key)
    if (cached && now - cached.ts < 1000 * 60 * 10) {
      return NextResponse.json(cached.data)
    }

    // Fetch streams
    const sources = await getAggregatedStreams(id)
    const data = { sources }

    // Cache the result
    cache.set(key, { ts: now, data })

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ sources: [] })
  }
}
