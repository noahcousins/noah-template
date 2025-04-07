import { NextRequest } from "next/server";
import { API_CONFIG } from "../../config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/todos/${params.id}`,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/todos/${params.id}`,
      {
        method: "PUT",
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error updating todo:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/todos/${params.id}`,
      {
        method: "DELETE",
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
