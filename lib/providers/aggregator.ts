// lib/providers/aggregator.ts

import { pluginRepo } from "./config";

export async function getAggregatedStreams(endpoint: string) {
  const url = `${pluginRepo.apiUrl}/${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${pluginRepo.apiKey}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
  return res.json();
}

export async function streamAggregatedStreams(endpoint: string) {
  // Example placeholder for streaming logic
  const data = await getAggregatedStreams(endpoint);
  return data;
}
