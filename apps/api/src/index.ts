import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

// Add Node.js types
declare const process: {
  env: {
    JWT_SECRET?: string;
  };
};

type Variables = JwtVariables & {
  user: any | null;
  session: any | null;
};

const app = new Hono<{ Variables: Variables }>();

// Add CORS middleware
app.use("/*", cors());

// Add JWT middleware for protected routes
app.use("/api/*", async (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET || "your-secret-key", // Replace with your actual secret
    cookie: "auth", // Optional: if you want to use cookie-based auth
  });
  return jwtMiddleware(c, next);
});

// Public endpoint
app.get("/", (c) => {
  return c.json({
    message: "Hello World",
  });
});

// Protected ping endpoint
app.get("/api/ping", (c) => {
  const payload = c.get("jwtPayload");
  return c.json({
    message: "Pong!",
    user: payload, // This will contain the user info from the JWT
  });
});

export default app;
