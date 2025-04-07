"use server";

import { createTodo } from "@/data-access/todo";
import { Todo } from "@/types/todo";

export const createTodoAction = async (todo: Todo) => {
  const newTodo = await createTodo(todo);
  return newTodo;
};
