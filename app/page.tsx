import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "./HomeClient";
import { redirect } from "next/navigation";
import { getCachedUserRole } from "@/lib/cache";

export default async function Home() {
  const { userId } = await auth();

  let userRole: string | null | undefined = undefined;

  if (userId) {
    userRole = await getCachedUserRole(userId);

    // STRICT GATEWAY: If logged in but no role, bounce to onboarding
    if (userRole === null) {
      redirect("/onboarding");
    }
  }

  return <HomeClient userRole={userRole} />;
}
