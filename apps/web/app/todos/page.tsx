import { TodoList } from "@/components/todo-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTodos } from "@/data-access/todo";

export default async function TodosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const initialTodos = await getTodos();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">My Todos</h1>
      {session?.user?.id && <TodoList initialTodos={initialTodos} />}
    </div>
  );
}
