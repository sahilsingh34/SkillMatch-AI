import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "./HomeClient";

// Ensure dynamic rendering to read the auth cookie correctly
export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  // undefined = not logged in (show public hero)
  // null     = logged in but no role yet (show onboarding chooser as hero)
  // string   = logged in with a role (show personalized hero)
  let userRole: string | null | undefined = undefined;

  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
      });
      // null = logged in but no role yet (shows onboarding chooser hero)
      userRole = user?.role ?? null;
    } catch (e) {
      console.error("Home: failed to fetch user role", e);
      // On DB error, fall back to public hero (undefined)
      userRole = undefined;
    }
  }

  return <HomeClient userRole={userRole} />;
}
