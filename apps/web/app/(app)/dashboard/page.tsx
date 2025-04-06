import { PingUser } from "@/components/ping-user";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6">
        <PingUser />
      </div>
    </div>
  );
}
