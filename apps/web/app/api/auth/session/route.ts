// Session validation API route
// This checks the current session and refreshes the JWT token if needed

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const SESSION_COOKIE_NAME = "better_auth_session";
const JWT_COOKIE_NAME = "auth_jwt";

export async function GET(request: NextRequest) {
  try {
    // Get current cookies
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const jwtCookie = cookieStore.get(JWT_COOKIE_NAME);

    console.log("API route: Session check");
    console.log("API route: Session cookie exists:", !!sessionCookie);
    console.log("API route: JWT cookie exists:", !!jwtCookie);

    // If we don't have any cookies, return null session
    if (!sessionCookie && !jwtCookie) {
      return NextResponse.json({ user: null, session: null });
    }

    // Prepare headers for API request
    const headers: Record<string, string> = {};
    if (sessionCookie) {
      headers.Cookie = `${SESSION_COOKIE_NAME}=${sessionCookie.value}`;
    }
    if (jwtCookie) {
      headers.Authorization = `Bearer ${jwtCookie.value}`;
    }

    // Check session with the backend API
    const sessionResponse = await fetch(`${API_URL}/session`, {
      headers,
      credentials: "include",
    });

    // If session is invalid, clear cookies and return null
    if (!sessionResponse.ok) {
      console.log("API route: Session invalid");
      
      const response = NextResponse.json({ user: null, session: null });
      
      // Clear cookies
      response.cookies.delete(SESSION_COOKIE_NAME);
      response.cookies.delete(JWT_COOKIE_NAME);
      
      return response;
    }

    // Session is valid
    const sessionData = await sessionResponse.json();
    console.log("API route: Session valid for user:", sessionData.user?.id);

    // Always refresh the JWT token when validating a session
    let jwtToken = jwtCookie?.value;

    try {
      const tokenResponse = await fetch(`${API_URL}/api/auth/token`, {
        headers: {
          Cookie: `${SESSION_COOKIE_NAME}=${sessionCookie?.value || ""}`,
        },
        credentials: "include",
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        if (tokenData.token) {
          jwtToken = tokenData.token;
          console.log("API route: JWT token refreshed");
        }
      }
    } catch (error) {
      console.error("API route: Error refreshing JWT token:", error);
    }

    // Create response with session data and updated cookies
    const response = NextResponse.json(sessionData);

    // Update JWT cookie if we have a token
    if (jwtToken) {
      response.cookies.set({
        name: JWT_COOKIE_NAME,
        value: jwtToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60, // 15 minutes
      });
    }

    return response;
  } catch (error) {
    console.error("API route: Unexpected session validation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}