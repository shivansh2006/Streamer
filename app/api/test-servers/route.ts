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

  console.log(`[TEST-SERVERS] Testing 6 integrated servers for TMDB ID: ${id}`)
  
  try {
    const streams = await getAllServerStreams(id, 'movie')
    
    return NextResponse.json({
      success: true,
      movieId: id,
      totalStreams: streams.length,
      streams: streams.map(s => ({
        provider: s.provider,
        quality: s.quality,
        url: s.url.substring(0, 100) + '...' // Truncate for readability
      })),
      fullStreams: streams // Include full URLs
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
