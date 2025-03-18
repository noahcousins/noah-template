import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
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
    secure: true, // Always use secure for cross-origin cookies
    sameSite: "none", // Required for cross-origin cookies
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:8787"], // Explicitly set trusted origins
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: authSchema,
  }),
  // Enable cross-domain cookies between Next.js and API
  advanced: {
    crossSubDomainCookies: {
      enabled: true, // Always enable for cross-origin communication
    },
    defaultCookieAttributes: {
      sameSite: "none", // Required for cross-origin cookies
      secure: true, // Always use secure for cross-origin cookies
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: serverEnv.auth.url,
        audience: serverEnv.auth.url,
        expirationTime: "15m", // 15 minutes
        definePayload: (user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      },
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519"
        },
      },
    }),
  ],
});
