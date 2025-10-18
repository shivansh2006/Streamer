// lib/providers/aggregator.ts

import { PROVIDER_CONFIG } from "./config";

export async function fetchData(endpoint: string) {
  // Example fetch from provider API
  const url = `${PROVIDER_CONFIG.apiUrl}/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${PROVIDER_CONFIG.apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }

  return res.json();
}
