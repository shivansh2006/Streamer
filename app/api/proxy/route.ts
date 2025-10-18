import { NextResponse } from 'next/server'

// Simple streaming proxy with optional headers and Range support.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const target = searchParams.get('url')
    if (!target) return NextResponse.json({ error: 'url is required' }, { status: 400 })

    const headers = new Headers()
    // Forward Range for HLS/MP4 partial requests
    const range = (req.headers as any).get?.('range') || (req as any).headers?.get?.('Range')
    if (range) headers.set('Range', range)

    // Optional custom headers base64 JSON in `h`
    const h = searchParams.get('h')
    if (h) {
      try {
        const decoded = JSON.parse(Buffer.from(h, 'base64').toString('utf-8')) as Record<string, string>
        for (const [k, v] of Object.entries(decoded)) {
          // Avoid overriding Host and dangerous headers
          if (/^host$/i.test(k)) continue
          headers.set(k, v)
        }
      } catch {}
    }

    const upstream = await fetch(target, { headers, redirect: 'follow' })
    // Mirror status and essential headers
    const resHeaders = new Headers()
    // Pass through content type/length/accept-ranges
    const copy = ['content-type', 'content-length', 'accept-ranges', 'content-range', 'cache-control']
    for (const k of copy) {
      const v = upstream.headers.get(k)
      if (v) resHeaders.set(k, v)
    }
    // Allow HLS in browser
    resHeaders.set('access-control-allow-origin', '*')

    return new NextResponse(upstream.body, { status: upstream.status, headers: resHeaders })
  } catch (e) {
    return NextResponse.json({ error: 'proxy failed' }, { status: 502 })
  }
}