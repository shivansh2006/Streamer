import { NextResponse } from 'next/server'
import getAllServerStreams(id) from '@/lib/providers/servers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idStr = searchParams.get('movieId')
    const id = idStr ? parseInt(idStr, 10) : NaN

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: 'movieId is required' }, { status: 400 })
    }

    console.log(`[TEST-SERVERS] Testing integrated servers for TMDB ID: ${id}`)

    // ✅ Use only ONE argument, per the earlier type error
    const streams = await getAllServerStreams(id).catch(err => {
      console.error('Stream fetch error:', err)
      return []
    })

    return NextResponse.json({
      success: true,
      movieId: id,
      totalStreams: streams.length,
      streams: streams.map(s => ({
        provider: s.provider,
        quality: s.quality,
        url: (s.url ?? '').substring(0, 100) + '...',
      })),
    })
  } catch (error: any) {
    console.error('[TEST-SERVERS] Fatal error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
