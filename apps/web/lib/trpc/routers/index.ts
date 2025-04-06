import { router } from "../server";
import { todoRouter } from "./todo";

export const appRouter = router({
  todos: todoRouter,
});

export type AppRouter = typeof appRouter;
