import { NextResponse } from 'next/server'
import { pluginRepo } from '@/lib/providers/config'

type ScraperEntry = {
  id: string
  name: string
  filename: string
  enabled?: boolean
}

type TapframeManifest = {
  name?: string
  version?: string
  scrapers?: ScraperEntry[]
}

export async function GET() {
  if (!pluginRepo) return NextResponse.json({ providers: [] })
  
  try {
    const manifestUrl = new URL('manifest.json', pluginRepo.apiUrl).toString()
    const res = await fetch(manifestUrl, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ providers: [] })
    
    const json: TapframeManifest = await res.json()
    const providers = (json.scrapers || [])
      .filter(s => s && typeof s.filename === 'string' && s.enabled !== false)
      .map(s => ({ id: s.id, name: s.name }))
    
    return NextResponse.json({ providers })
  } catch {
    return NextResponse.json({ providers: [] })
  }
}
