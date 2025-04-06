import { TodoList } from "@/components/TodoList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export default async function TodosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">My Todos</h1>
      {session?.user?.id && <TodoList userId={session?.user?.id} />}
    </div>
  );
}
