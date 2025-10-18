// lib/providers/config.ts

export const pluginRepo = {
  name: "DefaultProvider",
  apiUrl: "https://api.example.com",
  apiKey: process.env.TMDB_API_KEY || "",
};
