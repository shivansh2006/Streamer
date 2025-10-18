import { NextResponse } from 'next/server'
import { getAggregatedStreams } from '@/lib/providers/aggregator'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const idStr = searchParams.get('movieId')
  const id = idStr ? parseInt(idStr, 10) : NaN
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'movieId is required' }, { status: 400 })
  }
  try {
    const sources = await getAggregatedStreams(id)
    return NextResponse.json({ sources })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch stream' }, { status: 500 })
  }
}