import { authClient } from "./auth-client";

export async function pingUser() {
  try {
    // Get the JWT token from Better Auth client
    const result = await authClient.getSession();
    if (!result || !result.data) {
      throw new Error("No session found");
    }

    // Get the JWT token from the session
    const token = result.data.session.token;

    // Call the ping endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ping`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error pinging user:", error);
    throw error;
  }
}
