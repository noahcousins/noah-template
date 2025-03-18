import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for either the session cookie or JWT token
  const sessionCookie = request.cookies.get("better_auth_session")?.value;
  const jwtToken = request.cookies.get("auth_jwt")?.value;
  
  // Debug all cookies - use keys() instead of entries()
  console.log("All cookies:", Array.from(request.cookies.getAll()).map(cookie => cookie.name));
  
  // Public paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // User is authenticated if they have either a session or JWT
  const isAuthenticated = !!sessionCookie || !!jwtToken;

  console.log("Path:", request.nextUrl.pathname);
  console.log("isAuthenticated", isAuthenticated);
  console.log("isPublicPath", isPublicPath);
  console.log("sessionCookie", !!sessionCookie);
  console.log("jwtToken", !!jwtToken);

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    console.log("Redirecting to login due to missing authentication");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    console.log("Redirecting to dashboard due to existing authentication");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Create a response that passes through to the next middleware/route handler
  const response = NextResponse.next();
  
  // If we have cookies but they aren't properly set in the browser (cross-origin issues in dev),
  // manually forward them in the response
  if (sessionCookie) {
    response.cookies.set({
      name: "better_auth_session",
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  }
  
  if (jwtToken) {
    response.cookies.set({
      name: "auth_jwt",
      value: jwtToken,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  }
  
  return response;
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Static files (/_next/, /static/, /public/, /favicon.ico, etc)
     * - API routes (/api/*)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
