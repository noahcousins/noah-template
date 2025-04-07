"use client";

import { Todo } from "@/types/todo";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { nanoid } from "nanoid";

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const userId = useAuth();

  const addTodo = (newTodo: Todo) => {
    setTodos((prev) => [...prev, newTodo]);
  };

  const updateTodo = (tempId: string, serverTodo: Todo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === tempId ? serverTodo : todo))
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const reAddTodo = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  if (todos.length === 0) {
    return (
      <div className="space-y-8">
        {userId && (
          <TodoForm onTodoCreated={addTodo} onTodoUpdated={updateTodo} />
        )}
        <div className="text-center text-muted-foreground">
          No todos yet. Create one to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {userId && (
        <TodoForm onTodoCreated={addTodo} onTodoUpdated={updateTodo} />
      )}
      <div className="grid gap-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={removeTodo}
            onReAdd={reAddTodo}
          />
        ))}
      </div>
    </div>
  );
}
