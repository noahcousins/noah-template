import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { AppRouter } from "./routers";
import superjson from "superjson";

export const api = createTRPCReact<AppRouter>();

export const trpcClient = api.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
});
