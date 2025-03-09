import { z } from "zod";

// Define the environment schema with strong typing and validation
// Using .optional() and .default() to make development easier
const envSchema = z.object({
  // Database - DO NOT put real credentials in code
  DATABASE_URL: z.string().optional().default("postgresql://user:password@localhost:5432/db"),
  
  // Auth
  BETTER_AUTH_SECRET: z.string().optional().default("dev-only-secret-do-not-use-in-production"),
  BETTER_AUTH_URL: z.string().optional().default("http://localhost:8787"),
  ALLOWED_ORIGINS: z.string().optional().default("http://localhost:8787,http://localhost:3000"),

  // OAuth providers - all optional
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  TWITCH_CLIENT_ID: z.string().optional(),
  TWITCH_CLIENT_SECRET: z.string().optional(),
  GITLAB_CLIENT_ID: z.string().optional(),
  GITLAB_CLIENT_SECRET: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ENABLE_CROSS_SUBDOMAIN_COOKIES: z.enum(["true", "false"]).optional().default("true"),
});

// Handle environments where process is not available (like edge runtimes)
declare global {
  var process: { env: Record<string, string | undefined> } | undefined;
}

// Process env might be undefined in some environments
const processEnv = typeof process !== "undefined" ? process.env : {} as Record<string, string | undefined>;

// Function to safely get environment variables with validation
function getEnv() {
  try {
    // First try to parse with required fields
    return envSchema.parse(processEnv);
  } catch (error) {
    // SECURITY: In production, we should never use default database credentials
    if (processEnv.NODE_ENV === "production" && !processEnv.DATABASE_URL) {
      console.error("❌ Critical error: DATABASE_URL must be provided in production");
      throw new Error("DATABASE_URL is required in production");
    }
    
    if (processEnv.NODE_ENV === "production" && !processEnv.BETTER_AUTH_SECRET) {
      console.error("❌ Critical error: BETTER_AUTH_SECRET must be provided in production");
      throw new Error("BETTER_AUTH_SECRET is required in production");
    }
    
    console.warn("⚠️ Using default environment values for development");
    // Fall back to parsing with defaults
    return envSchema.parse(processEnv);
  }
}

// Create a strongly typed env object
const env = getEnv();

// Structured environment variables
export const serverEnv = {
  database: {
    url: env.DATABASE_URL,
  },
  auth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL,
    allowedOrigins: env.ALLOWED_ORIGINS?.split(",") || [],
    crossSubdomainCookies: env.ENABLE_CROSS_SUBDOMAIN_COOKIES === "true",
    providers: {
      discord: env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET
        ? { clientId: env.DISCORD_CLIENT_ID, clientSecret: env.DISCORD_CLIENT_SECRET }
        : null,
      google: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }
        : null,
      github: env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
        ? { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET }
        : null,
      microsoft: env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET
        ? { clientId: env.MICROSOFT_CLIENT_ID, clientSecret: env.MICROSOFT_CLIENT_SECRET }
        : null,
      twitch: env.TWITCH_CLIENT_ID && env.TWITCH_CLIENT_SECRET
        ? { clientId: env.TWITCH_CLIENT_ID, clientSecret: env.TWITCH_CLIENT_SECRET }
        : null,
      gitlab: env.GITLAB_CLIENT_ID && env.GITLAB_CLIENT_SECRET
        ? { clientId: env.GITLAB_CLIENT_ID, clientSecret: env.GITLAB_CLIENT_SECRET }
        : null,
    },
  },
  environment: {
    isProduction: env.NODE_ENV === "production",
    isDevelopment: env.NODE_ENV === "development",
    isTest: env.NODE_ENV === "test",
    nodeEnv: env.NODE_ENV,
  },
};

// For client-side usage (only public variables)
export const clientEnv = {
  auth: {
    url: env.BETTER_AUTH_URL,
  },
  environment: {
    isProduction: env.NODE_ENV === "production",
    isDevelopment: env.NODE_ENV === "development",
    nodeEnv: env.NODE_ENV,
  },
};

export default serverEnv;