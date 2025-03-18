"use client";

import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, JWT_COOKIE_NAME } from "./auth";

// Client-side authentication functions
export async function login(email: string, password: string) {
  console.log("Login attempt for:", email);
  
  try {
    // Need to use absolute URL because we're in a client component
    const baseUrl = window.location.origin;
    
    // Make the login request through our own API route
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("Login failed:", error);
      throw new Error(error || "Failed to login");
    }
    
    const result = await response.json();
    console.log("Login successful:", result);
    
    return result.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logout() {
  console.log("Logging out user");
  
  const baseUrl = window.location.origin;
  
  // Use our local API route for logout
  await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    cache: "no-store",
  });
  
  // Client-side redirect to login page
  window.location.href = "/auth/login";
}

export async function validateSession() {
  console.log("Validating session");
  
  try {
    const baseUrl = window.location.origin;
    
    // Use our local API route for session validation
    const response = await fetch(`${baseUrl}/api/auth/session`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      console.error("Session validation failed");
      return null;
    }
    
    const sessionData = await response.json();
    
    if (!sessionData.user) {
      console.log("No user in session");
      return null;
    }
    
    console.log("Session valid for user:", sessionData.user.id);
    return sessionData;
  } catch (error) {
    console.error("Failed to validate session:", error);
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    // Ensure we have the auth token (validate session if needed)
    await validateSession();
    
    // Make request with credentials to ensure cookies are sent
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      cache: "no-store",
    });
    
    return response;
  } catch (error) {
    console.error("Failed to fetch with auth:", error);
    throw error;
  }
}