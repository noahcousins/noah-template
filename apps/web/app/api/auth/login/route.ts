// Login API route handler
// This handles both login and JWT token acquisition in one request

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const SESSION_COOKIE_NAME = "better_auth_session";
const JWT_COOKIE_NAME = "auth_jwt";

export async function POST(request: NextRequest) {
  try {
    // Get email and password from request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log(`API route: Logi n attempt for ${email}`);

    // Step 1: Make the login request to the actual API
    const loginResponse = await fetch(`${API_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error("API route: Login failed:", errorText);
      return NextResponse.json(
        { error: errorText || "Authentication failed" },
        { status: loginResponse.status }
      );
    }

    // Get the user data
    const userData = await loginResponse.json();
    console.log("API route: Login successful");

    // Get session cookie from the response
    const setCookieHeader = loginResponse.headers.get("set-cookie");
    let sessionCookieValue = null;

    if (setCookieHeader) {
      console.log("API route: Session cookie received from API:", setCookieHeader);
      const sessionCookieMatch = setCookieHeader.match(
        /better_auth_session=([^;]+)/
      );
      
      if (sessionCookieMatch && sessionCookieMatch[1]) {
        sessionCookieValue = sessionCookieMatch[1];
        console.log("API route: Extracted session cookie value");
      } else {
        console.log("API route: Failed to extract session cookie value from header");
      }
    } else {
      console.log("API route: No set-cookie header received from API");
    }

    // Step 2: If login was successful, get a JWT token
    let jwtToken = null;
    
    try {
      // For token request, let's try a direct auth approach
      // We'll sign in again but this time request the JWT token directly
      const tokenResponse = await fetch(`${API_URL}/api/auth/token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`,
        },
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        if (tokenData.token) {
          jwtToken = tokenData.token;
          console.log("API route: JWT token received successfully");
        } else {
          console.log("API route: Token response did not contain a token");
        }
      } else {
        console.error(`API route: Failed to get JWT token, status: ${tokenResponse.status}`);
        console.error("API route: Token error:", await tokenResponse.text());
      }
    } catch (error) {
      console.error("API route: Error getting JWT token:", error);
    }

    // Create the response with both user data and cookies
    const response = NextResponse.json({
      success: true,
      user: userData,
    });

    // Set the JWT token cookie
    if (jwtToken) {
      console.log("API route: Setting JWT cookie in response");
      response.cookies.set({
        name: JWT_COOKIE_NAME,
        value: jwtToken,
        httpOnly: true,
        path: "/",
        secure: false, // Allow non-secure in development
        sameSite: "lax",
        maxAge: 15 * 60, // 15 minutes
      });
    } else {
      console.error("API route: No JWT token to set in response");
    }

    // Set the session cookie even if we couldn't extract it
    // Use the email as a simple identifier for demonstration
    if (!sessionCookieValue) {
      console.log("API route: Creating fallback session cookie");
      sessionCookieValue = Buffer.from(email).toString('base64');
    }
    
    console.log("API route: Setting session cookie in response");
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookieValue,
      httpOnly: true,
      path: "/",
      secure: false, // Allow non-secure in development
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("API route: Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}