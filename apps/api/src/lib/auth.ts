import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  db,
  users,
  sessions,
  accounts,
  verificationTokens,
} from "@repo/db/index";

const providers = [
  "discord",
  "google",
  "github",
  "microsoft",
  "twitch",
  "gitlab",
];

const configuredProviders = providers.reduce<
  Record<string, { clientId: string; clientSecret: string }>
>((acc, provider) => {
  const id = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
  const secret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];
  if (id && id.length > 0 && secret && secret.length > 0) {
    acc[provider] = { clientId: id, clientSecret: secret };
  }
  return acc;
}, {});

const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verificationToken: verificationTokens,
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8787",
  secret: process.env.BETTER_AUTH_SECRET || "default-better-auth-secret",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  trustedOrigins: ["http://localhost:3000"],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: authSchema,
  }),
  // Enable cross-subdomain cookies since Next.js and API are on different origins
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
