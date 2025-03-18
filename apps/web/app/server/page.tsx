import { getAuthToken } from "@/lib/auth";

export default async function ServerPage() {
  const token = await getAuthToken();

  if (!token) {
    return <div>No token</div>;
  }

  const response = await fetch("http://localhost:8787/api/auth/get-session", {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(response);

  const data = await response.json();

  return <div>{JSON.stringify(data)}</div>;
}
