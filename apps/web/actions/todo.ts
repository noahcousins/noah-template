"use server";

import {
  updateTodo,
  createTodo as createTodoData,
  deleteTodo as deleteTodoData,
} from "@/data-access/todo";
import { Todo } from "@/types/todo";

export async function toggleTodo(id: string, completed: boolean) {
  try {
    const updatedTodo = await updateTodo(id, { completed });
    return { success: true, todo: updatedTodo };
  } catch (error) {
    console.error("Failed to toggle todo:", error);
    return { success: false, error: "Failed to toggle todo" };
  }
}

export async function createTodo(todo: Omit<Todo, "id">) {
  try {
    const newTodo = await createTodoData(todo);
    return { success: true, todo: newTodo };
  } catch (error) {
    console.error("Failed to create todo:", error);
    return { success: false, error: "Failed to create todo" };
  }
}

export async function deleteTodo(id: string) {
  try {
    await deleteTodoData(id);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return { success: false, error: "Failed to delete todo" };
  }
}
