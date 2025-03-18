import { redirect } from "next/navigation";
import { validateSession, fetchWithAuth } from "@/lib/auth";

export default async function DashboardPage() {
  // Validate the session server-side
  const session = await validateSession();
  
  if (!session) {
    // Redirect to login if session is invalid
    redirect("/auth/login");
  }
  
  // Fetch protected data from API
  const response = await fetchWithAuth("/api/protected/user-data");
  let userData = null;
  
  if (response.ok) {
    userData = await response.json();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {session.user?.name || session.user?.email}</h2>
        <p className="text-gray-600">You are successfully authenticated!</p>
      </div>
      
      {userData ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Protected Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-yellow-600">No protected data available or failed to fetch data.</p>
        </div>
      )}
      
      <div className="mt-6">
        <form action="/api/auth/logout" method="post">
          <button 
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}