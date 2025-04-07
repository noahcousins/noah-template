"use client";

import { Todo } from "@/types/todo";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { createTodo } from "@/actions/todo";
import { useState, useTransition } from "react";
import { useAuth } from "@/lib/auth-context";
import { nanoid } from "nanoid";

interface TodoFormProps {
  onTodoCreated: (todo: Todo) => void;
  onTodoUpdated: (tempId: string, serverTodo: Todo) => void;
}

export function TodoForm({ onTodoCreated, onTodoUpdated }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const userId = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !userId) return;

    const tempId = nanoid();
    const newTodo: Todo = {
      id: tempId,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      userId,
    };

    // Optimistically update the UI
    onTodoCreated(newTodo);

    // Clear the form
    setTitle("");
    setDescription("");

    // Start the server action
    startTransition(async () => {
      const result = await createTodo(newTodo);
      if (result.success && result.todo) {
        onTodoUpdated(tempId, result.todo);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add some details..."
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        Add Todo
      </Button>
    </form>
  );
}
