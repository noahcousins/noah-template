import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

// Create a database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export const getDb = ({ url }: { url: string }) => {
  const sql = neon(url);
  return drizzle(sql, { schema });
};

// Export schema for use in other parts of the application
export * from "./schema";
