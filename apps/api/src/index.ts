import { Hono } from "hono";
import { cors } from "hono/cors";
import { getDb } from "@repo/db/index";
import { users } from "@repo/db/schema/auth";
import todosRouter from "./routes/todos";

type Variables = {
  user: any | null;
  session: any | null;
};

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{
  Variables: Variables;
  Bindings: Bindings;
}>();

// Apply CORS middleware if needed
app.use("/*", cors());

app.get("/", (c) => {
  return c.json({
    message: "Hello World",
  });
});

app.get("/api/users", async (c) => {
  // Get database URL from environment variables
  const dbUrl = c.env.DATABASE_URL;

  // Pass database URL to getDb function
  const db = getDb({
    url: dbUrl,
  });

  const usersData = await db.select().from(users);
  return c.json({
    message: "Users",
    users: usersData,
  });
});

// Mount todos routes
app.route("/api/todos", todosRouter);

export default app;
