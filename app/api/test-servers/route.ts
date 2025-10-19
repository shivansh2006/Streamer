import { NextResponse } from 'next/server'
import { getAllServerStreams } from '@/lib/providers/servers'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const idStr = searchParams.get('movieId')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'movieId is required' }, { status: 400 })
  }

  console.log(`[TEST-SERVERS] Testing integrated servers for TMDB ID: ${id}`)

  try {
    // ✅ FIXED: removed extra argument (function expects 0 params)
    const streams = await getAllServerStreams().catch(err => {
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
        url: s.url?.substring(0, 100) + '...' // truncate long URLs
      })),
      fullStreams: streams // keep full URLs
    })
  } catch (error: any) {
    console.error('[TEST-SERVERS] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
