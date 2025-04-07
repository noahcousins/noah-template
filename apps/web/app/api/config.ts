export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_EXTERNAL_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
} as const;
