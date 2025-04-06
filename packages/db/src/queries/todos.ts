import { getDb } from "../index";
import { todos } from "../schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
export async function getAllTodos(dbUrl: string) {
  const db = getDb({ url: dbUrl });
  return db.select().from(todos);
}

export async function getTodoById(dbUrl: string, id: string) {
  const db = getDb({ url: dbUrl });
  return db.select().from(todos).where(eq(todos.id, id));
}

export async function createTodo(
  dbUrl: string,
  data: {
    title: string;
    description?: string;
    userId: string;
  }
) {
  const db = getDb({ url: dbUrl });
  const newTodo = {
    id: nanoid(),
    title: data.title,
    description: data.description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: data.userId,
  };

  await db.insert(todos).values(newTodo);
  return newTodo;
}

export async function updateTodo(
  dbUrl: string,
  id: string,
  data: Partial<{
    title: string;
    description: string;
    completed: boolean;
  }>
) {
  const db = getDb({ url: dbUrl });
  const existingTodo = await getTodoById(dbUrl, id);

  if (!existingTodo.length) {
    throw new Error("Todo not found");
  }

  const updatedTodo = {
    ...existingTodo[0],
    ...data,
    updatedAt: new Date(),
  };

  await db.update(todos).set(updatedTodo).where(eq(todos.id, id));

  return updatedTodo;
}

export async function deleteTodo(dbUrl: string, id: string) {
  const db = getDb({ url: dbUrl });
  const existingTodo = await getTodoById(dbUrl, id);

  if (!existingTodo.length) {
    throw new Error("Todo not found");
  }

  await db.delete(todos).where(eq(todos.id, id));
  return { message: "Todo deleted successfully" };
}
