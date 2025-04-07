"use client";

import { Todo } from "@/types/todo";
import { Card } from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Button } from "@repo/ui/components/button";
import { Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { toggleTodo, deleteTodo } from "@/actions/todo";
import { useState, useTransition } from "react";
import { Alert, AlertDescription } from "@repo/ui/components/alert";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onReAdd: (todo: Todo) => void;
}

export function TodoItem({
  todo: initialTodo,
  onDelete,
  onReAdd,
}: TodoItemProps) {
  const [todo, setTodo] = useState(initialTodo);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (checked: boolean) => {
    // Optimistically update the UI
    setTodo((prev) => ({ ...prev, completed: checked }));

    // Start the server action
    startTransition(async () => {
      await toggleTodo(todo.id!, checked);
    });
  };

  const handleDelete = async () => {
    // Optimistically update the UI
    onDelete(todo.id!);
    setError(null);

    // Start the server action
    startTransition(async () => {
      const result = await deleteTodo(todo.id!);
      if (!result.success) {
        // Re-add the todo and show error
        onReAdd(todo);
        setError(result.error || "Failed to delete todo");
      }
    });
  };

  const handleRetry = () => {
    handleDelete();
  };

  return (
    <Card className="p-4 group relative">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
          <h3 className="text-lg font-semibold">{todo.title}</h3>
          <div className="absolute right-2 top-2 flex gap-2">
            {error && (
              <Alert
                variant="destructive"
                className="absolute -top-12 right-0 w-64"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </Alert>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {todo.description && (
          <p className="text-muted-foreground">{todo.description}</p>
        )}
      </div>
    </Card>
  );
}
