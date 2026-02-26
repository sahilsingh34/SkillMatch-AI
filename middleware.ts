import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/onboarding',
]);

// Optionally define recruiter-only routes in the future
// const isRecruiterRoute = createRouteMatcher(['/dashboard/recruiter(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
