import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { serverEnv } from "@repo/env";

import * as schema from "./schema";

// Create a database connection with a safer approach
const sql = neon(
  "postgresql://neondb_owner:npg_3OBdWDQX5GHJ@ep-late-base-a8w4fngi-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql, { schema });

// Alternative method for custom connection URL
export const getDb = ({ url }: { url: string }) => {
  const sql = neon(url);
  return drizzle(sql, { schema });
};

// Export schema for use in other parts of the application
export * from "./schema";
