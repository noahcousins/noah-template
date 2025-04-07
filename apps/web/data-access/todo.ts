import { Todo } from "@/types/todo";
import { API_CONFIG } from "@/app/api/config";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getAuthHeaders = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return {
    ...API_CONFIG.headers,
    "X-User-ID": session.user.id,
  };
};

export const getTodos = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseUrl}/api/todos`, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.todos;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw error;
  }
};

export const getTodoById = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseUrl}/api/todos/${id}`, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.todo;
  } catch (error) {
    console.error(`Failed to fetch todo with id ${id}:`, error);
    throw error;
  }
};

export const createTodo = async (todo: Omit<Todo, "id">) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseUrl}/api/todos`, {
      method: "POST",
      headers,
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.todo;
  } catch (error) {
    console.error("Failed to create todo:", error);
    throw error;
  }
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseUrl}/api/todos/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result.todo;
  } catch (error) {
    console.error(`Failed to update todo with id ${id}:`, error);
    throw error;
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_CONFIG.baseUrl}/api/todos/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to delete todo with id ${id}:`, error);
    throw error;
  }
};
