import { streamAggregatedStreams } from '@/lib/providers/aggregator'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const idStr = searchParams.get('movieId')
  const id = idStr ? parseInt(idStr, 10) : NaN
  
  if (!id || Number.isNaN(id)) {
    return new Response(JSON.stringify({ error: 'movieId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const encoder = new TextEncoder()
  let streamCount = 0

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start' })}\n\n`))

        // Stream sources progressively as they're found
        for await (const source of streamAggregatedStreams(id)) {
          streamCount++
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'stream', data: source })}\n\n`)
          )
        }

        // Send completion message
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'complete', total: streamCount })}\n\n`)
        )
        
        controller.close()
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Failed to fetch streams' })}\n\n`)
        )
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
