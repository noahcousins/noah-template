"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";

type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export function TodoList({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: todos, refetch } = api.todos.getAllTodos.useQuery();
  const createTodo = api.todos.createTodo.useMutation({
    onSuccess: () => {
      setTitle("");
      setDescription("");
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodo.mutate({
      title,
      description,
      userId,
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded border p-2"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full rounded border p-2"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={createTodo.isPending}
        >
          {createTodo.isPending ? "Creating..." : "Create Todo"}
        </button>
      </form>

      <div className="space-y-2">
        {todos?.map((todo: Todo) => (
          <div key={todo.id} className="rounded border p-4">
            <h3 className="text-lg font-semibold">{todo.title}</h3>
            {todo.description && (
              <p className="text-gray-600">{todo.description}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {
                  // TODO: Implement update
                }}
              />
              <span className="text-sm text-gray-500">
                {todo.completed ? "Completed" : "Not completed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
