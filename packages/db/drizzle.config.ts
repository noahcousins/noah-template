import { defineConfig } from "drizzle-kit";
import { serverEnv } from "@repo/env";

// Load environment variables
const dbUrl = serverEnv.database.url;

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
