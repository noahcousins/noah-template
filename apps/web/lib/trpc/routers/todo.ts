import { z } from "zod";
import { publicProcedure, router } from "../server";

export const todoRouter = router({
  getAllTodos: publicProcedure.query(async () => {
    const response = await fetch("http://localhost:8787/api/todos");
    const data = await response.json();
    return data.todos;
  }),

  getTodoById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const response = await fetch(`http://localhost:8787/api/todos/${input}`);
    const data = await response.json();
    return data.todo;
  }),

  createTodo: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await fetch("http://localhost:8787/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return data.todo;
    }),

  updateTodo: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const response = await fetch(`http://localhost:8787/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.todo;
    }),

  deleteTodo: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const response = await fetch(`http://localhost:8787/api/todos/${input}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  }),
});
