import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { serverEnv } from "@repo/env";

import * as schema from "./schema/index";

// Create a database connection with a safer approach
const sql = neon(serverEnv.database.url);
export const db = drizzle(sql, { schema });

// Alternative method for custom connection URL
export const getDb = ({ url }: { url: string }) => {
  const sql = neon(url);
  return drizzle(sql, { schema });
};

// Export schema for use in other parts of the application
export { schema };
