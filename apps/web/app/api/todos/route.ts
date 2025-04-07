import { NextRequest } from "next/server";
import { API_CONFIG } from "../config";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const response = await fetch(`${API_CONFIG.baseUrl}/api/todos`, {
      headers: {
        ...API_CONFIG.headers,
        "X-User-ID": session.user.id,
      },
    });

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${API_CONFIG.baseUrl}/api/todos`, {
      method: "POST",
      headers: {
        ...API_CONFIG.headers,
        "X-User-ID": session.user.id,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error creating todo:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
