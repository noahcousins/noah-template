import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const SESSION_COOKIE_NAME = "better_auth_session";
const JWT_COOKIE_NAME = "auth_jwt";

export async function POST() {
  console.log("API route: Logout request");
  
  // Call the auth API to sign out
  try {
    await fetch(`${API_URL}/api/auth/sign-out`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `${SESSION_COOKIE_NAME}=${cookies().get(SESSION_COOKIE_NAME)?.value || ""}`,
      },
    });
    console.log("API route: Sign-out request sent to API");
  } catch (error) {
    console.error("API route: Error signing out from API:", error);
  }
  
  // Clear all auth cookies
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete(JWT_COOKIE_NAME);
  
  console.log("API route: Cookies cleared");
  
  return response;
}