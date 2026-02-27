"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignUserRoleAction(role: "SEEKER" | "RECRUITER") {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Fetch the Clerk user to get their real email and names for the DB record
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `user_${userId}@clerk.local`;
    const firstName = clerkUser?.firstName;
    const lastName = clerkUser?.lastName;

    try {
        // Use upsert to handle brand-new users who have no DB record yet
        await prisma.user.upsert({
            where: { clerkId: userId },
            update: { role, firstName, lastName },
            create: {
                clerkId: userId,
                email,
                role,
                firstName,
                lastName,
            },
        });

        revalidatePath("/");
        revalidatePath("/dashboard");

        return { success: true, redirectTo: role === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/profile" };
    } catch (error: any) {
        console.error("Failed to assign role:", error);

        // Handle edge case where a user deleted their Clerk account and recreated it
        // This causes a Unique Constraint violation on `email` since their DB record still exists
        if (error?.code === 'P2002') {
            try {
                console.log(`Recovering user ${email} with new Clerk ID ${userId}`);
                await prisma.user.update({
                    where: { email },
                    data: { clerkId: userId, role }
                });

                revalidatePath("/");
                revalidatePath("/dashboard");
                return { success: true, redirectTo: role === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/profile" };
            } catch (recoveryError: any) {
                console.error("Failed to recover user:", recoveryError);
                return { success: false, error: "Database conflict recovery failed." };
            }
        }

        // Pass actual error message back to the frontend toast for debugging
        return {
            success: false,
            error: error instanceof Error ? error.message : "Database error syncing role."
        };
    }
}
