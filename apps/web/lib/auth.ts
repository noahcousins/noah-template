"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
export const SESSION_COOKIE_NAME = "better_auth_session";
export const JWT_COOKIE_NAME = "auth_jwt";

// Server-side authentication actions
export async function serverLogout() {
  // Clear cookies
  cookies().delete(SESSION_COOKIE_NAME);
  cookies().delete(JWT_COOKIE_NAME);
  
  // Redirect to login page
  redirect("/auth/login");
}

export async function getAuthToken() {
  return cookies().get(JWT_COOKIE_NAME)?.value;
}

export async function getSessionCookie() {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}

// Server-side methods to refresh JWT tokens
export async function refreshAuthToken() {
  try {
    // Get the session cookie
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionCookie) {
      return null;
    }
    
    // Try to get a new JWT token
    const response = await fetch(`${API_URL}/api/auth/token`, {
      headers: {
        Cookie: `${SESSION_COOKIE_NAME}=${sessionCookie}`,
      },
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Store the JWT in a cookie
    if (data.token) {
      cookies().set({
        name: JWT_COOKIE_NAME,
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 minutes
      });
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to refresh JWT token:", error);
    return null;
  }
}
