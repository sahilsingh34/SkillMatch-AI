import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "./HomeClient";
import { redirect } from "next/navigation";

// Ensure dynamic rendering to read the auth cookie correctly
export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  let userRole: string | null | undefined = undefined;

  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
      });
      userRole = user?.role ?? null;

      // STRICT GATEWAY: If logged in but no role, bounce to onboarding
      if (userRole === null) {
        redirect("/onboarding");
      }
    } catch (e) {
      console.error("Home: failed to fetch user role", e);
      userRole = undefined;
    }
  }

  return <HomeClient userRole={userRole} />;
}
