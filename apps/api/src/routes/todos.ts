import { Hono } from "hono";
import { nanoid } from "nanoid";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByUserId,
} from "@repo/db/queries/todos";

type Variables = {
  user: any | null;
  session: any | null;
};

type Bindings = {
  DATABASE_URL: string;
};

const todosRouter = new Hono<{
  Variables: Variables;
  Bindings: Bindings;
}>();

// Get all todos for the user
todosRouter.get("/", async (c) => {
  const userId = c.req.header("X-User-ID");
  if (!userId) {
    return c.json({ error: "Missing user ID" }, 401);
  }

  const todosData = await getTodosByUserId(c.env.DATABASE_URL, userId);
  return c.json({ todos: todosData });
});

// Get todo by ID
todosRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.header("X-User-ID");
  if (!userId) {
    return c.json({ error: "Missing user ID" }, 401);
  }

  const todo = await getTodoById(c.env.DATABASE_URL, id);

  if (!todo.length) {
    return c.json({ error: "Todo not found" }, 404);
  }

  // Check if the todo belongs to the user
  if (todo[0]?.userId !== userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  return c.json({ todo: todo[0] });
});

// Create todo
todosRouter.post("/", async (c) => {
  const userId = c.req.header("X-User-ID");
  if (!userId) {
    return c.json({ error: "Missing user ID" }, 401);
  }

  const body = await c.req.json();
  const newTodo = await createTodo(c.env.DATABASE_URL, {
    title: body.title,
    description: body.description,
    userId: userId,
  });
  return c.json({ todo: newTodo }, 201);
});

// Update todo
todosRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.header("X-User-ID");
  if (!userId) {
    return c.json({ error: "Missing user ID" }, 401);
  }

  const body = await c.req.json();

  const existingTodo = await getTodoById(c.env.DATABASE_URL, id);
  if (!existingTodo.length) {
    return c.json({ error: "Todo not found" }, 404);
  }

  // Check if the todo belongs to the user
  if (existingTodo[0]?.userId !== userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const updatedTodo = await updateTodo(c.env.DATABASE_URL, id, body);
    return c.json({ todo: updatedTodo });
  } catch (error) {
    if (error instanceof Error && error.message === "Todo not found") {
      return c.json({ error: "Todo not found" }, 404);
    }
    throw error;
  }
});

// Delete todo
todosRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.header("X-User-ID");
  if (!userId) {
    return c.json({ error: "Missing user ID" }, 401);
  }

  const existingTodo = await getTodoById(c.env.DATABASE_URL, id);
  if (!existingTodo.length) {
    return c.json({ error: "Todo not found" }, 404);
  }

  // Check if the todo belongs to the user
  if (existingTodo[0]?.userId !== userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const result = await deleteTodo(c.env.DATABASE_URL, id);
    return c.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Todo not found") {
      return c.json({ error: "Todo not found" }, 404);
    }
    throw error;
  }
});

export default todosRouter;
