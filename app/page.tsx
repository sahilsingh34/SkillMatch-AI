import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "./HomeClient";
import { redirect } from "next/navigation";
import { getCachedUserRole } from "@/lib/cache";

export default async function Home() {
  try {
    const { userId } = await auth();
    let userRole: string | null | undefined = undefined;

    if (userId) {
      // Wrap the database call to prevent whole-page crash
      try {
        userRole = await getCachedUserRole(userId);
        
        if (userRole === null) {
          redirect("/onboarding");
        }
      } catch (dbError) {
        console.error("Home Page: Database fetch failed", dbError);
        // Fallback to undefined so the page still renders
        userRole = undefined;
      }
    }

    return <HomeClient userRole={userRole} />;
  } catch (authError) {
    console.error("Home Page: Auth check failed", authError);
    // If Auth itself fails (Clerk keys missing), we'll at least see this in logs
    return <HomeClient userRole={undefined} />;
  }
}
