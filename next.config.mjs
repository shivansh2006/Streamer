// lib/providers/config.ts

// Configuration for external streaming provider/aggregator service
// Environment variables can be set in Netlify dashboard or a local .env file
export const providerConfig = {
  name: process.env.PROVIDER_NAME || "DefaultProvider",
  apiUrl: process.env.PROVIDER_API_URL || "https://api.example.com",
  apiKey: process.env.PROVIDER_API_KEY || "",
}
