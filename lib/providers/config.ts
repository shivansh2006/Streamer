// lib/providers/config.ts

export const PROVIDER_CONFIG = {
  name: "DefaultProvider",
  apiUrl: "https://api.example.com",
  apiKey: process.env.TMDB_API_KEY || "",
};
