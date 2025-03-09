import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { serverEnv } from "@repo/env";
import {
  db,
  users,
  sessions,
  accounts,
  verificationTokens,
} from "@repo/db/index";

// Fixed schema with correct model name mapping
const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verificationToken: verificationTokens,
};

// Get configured OAuth providers from environment
const configuredProviders = Object.entries(serverEnv.auth.providers)
  .filter(([_, config]) => config !== null)
  .reduce((acc, [provider, config]) => {
    if (config) {
      acc[provider] = config;
    }
    return acc;
  }, {} as Record<string, { clientId: string; clientSecret: string }>);

export const auth = betterAuth({
  baseURL: serverEnv.auth.url,
  secret: serverEnv.auth.secret,
  socialProviders: configuredProviders,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  cookie: {
    name: "better_auth_session",
    httpOnly: true,
    path: "/",
    secure: serverEnv.environment.isProduction,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  trustedOrigins: serverEnv.auth.allowedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: authSchema,
  }),
  // Enable cross-subdomain cookies since Next.js and API are on different origins
  advanced: {
    crossSubDomainCookies: {
      enabled: serverEnv.auth.crossSubdomainCookies,
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: serverEnv.environment.isProduction,
    },
  },
});
