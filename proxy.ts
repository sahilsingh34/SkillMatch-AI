import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

console.log("[Proxy] Initializing with ENV check:", {
  has_clerk_key: !!process.env.CLERK_SECRET_KEY,
  has_publishable_key: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
});

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/jobs(.*)",
  "/api/upload(.*)", // Handled internally with auth checks
  "/api/v1/jobs(.*)",
  "/auth/(.*)",
  "/api/test-db",
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
