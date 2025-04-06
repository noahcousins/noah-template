import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db/index";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true, // Since Drizzle typically uses plural table names
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseUrl: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  plugins: [jwt(), nextCookies()], // make sure this is the last plugin in the array
  // Add any social providers you want to use
  // socialProviders: {
  //   github: {
  //     clientId: serverEnv.auth.githubClientId,
  //     clientSecret: serverEnv.auth.githubClientSecret,
  //   },
  // },
});
