// lib/providers/aggregator.ts

// Safe access to environment variables in both Node and Edge without typing 'process' directly
const env = (() => {
  try {
    // Using Function constructor avoids TypeScript complaining about 'process'
    // eslint-disable-next-line no-new-func
    return (Function('return (typeof process !== "undefined" && process.env) || {}'))() as Record<string, string | undefined>
  } catch {
    return {} as Record<string, string | undefined>
  }
})()

const providerConfig = {
  name: env.PROVIDER_NAME || 'DefaultProvider',
  apiUrl: env.PROVIDER_API_URL || 'https://api.example.com',
  apiKey: env.PROVIDER_API_KEY || '',
}

export type StreamSource = {
  name: string
  url: string
  quality?: string
  headers?: Record<string, string>
}

// Fetch all stream sources for a given movieId from a provider API
export async function getAggregatedStreams(movieId: number): Promise<StreamSource[]> {
  const base = providerConfig.apiUrl?.replace(/\/$/, "") || "https://api.example.com"
  // Convention: provider expects movieId as a query string. Adjust as needed.
  const url = `${base}/streams?movieId=${encodeURIComponent(String(movieId))}`
  const res = await fetch(url, {
    headers: providerConfig.apiKey ? { Authorization: `Bearer ${providerConfig.apiKey}` } : undefined,
    // Avoid caching on the server to keep results fresh
    cache: 'no-store'
  })
  if (!res.ok) throw new Error(`Failed to fetch streams (status ${res.status})`)
  const data = (await res.json()) as { sources?: StreamSource[] } | StreamSource[]
  const sources = Array.isArray(data) ? data : data?.sources || []
  return sources
}

// Async generator to progressively yield sources for SSE endpoints
export async function* streamAggregatedStreams(movieId: number): AsyncGenerator<StreamSource, void, unknown> {
  const sources = await getAggregatedStreams(movieId)
  for (const src of sources) {
    yield src
    // tiny delay to avoid flooding the client; adjust/remove as needed
    await new Promise((r) => setTimeout(r, 10))
  }
}
