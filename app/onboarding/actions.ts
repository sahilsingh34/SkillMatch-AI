"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignUserRoleAction(role: "SEEKER" | "RECRUITER") {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Fetch the Clerk user to get their real email for the DB record
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `user_${userId}@clerk.local`;

    try {
        // Use upsert to handle brand-new users who have no DB record yet
        await prisma.user.upsert({
            where: { clerkId: userId },
            update: { role },
            create: {
                clerkId: userId,
                email,
                role,
            },
        });

        revalidatePath("/");
        revalidatePath("/dashboard");

        return { success: true, redirectTo: role === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/profile" };
    } catch (error) {
        console.error("Failed to assign role:", error);
        return { success: false, error: "Failed to set role" };
    }
}
