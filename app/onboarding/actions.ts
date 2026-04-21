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
    
    if (!clerkUser) {
        return { success: false, error: "Authentication session expired. Please log in again." };
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!email) {
        return { success: false, error: "No primary email found in your Clerk account." };
    }

    const firstName = clerkUser.firstName ?? "";
    const lastName = clerkUser.lastName ?? "";

    try {
        console.log(`Setting role ${role} for user ${userId} (${email})`);
        
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
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            try {
                console.log(`Recovering user ${email} with new Clerk ID ${userId}`);
                await prisma.user.update({
                    where: { email },
                    data: { clerkId: userId, role, firstName, lastName }
                });

                revalidatePath("/");
                revalidatePath("/dashboard");
                return { success: true, redirectTo: role === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/profile" };
            } catch (recoveryError: any) {
                console.error("Failed to recover user account:", recoveryError);
                return { success: false, error: "Database conflict: This email is already associated with another account." };
            }
        }

        return {
            success: false,
            error: "Database error: Could not save your profile choice. Please try again."
        };
    }
}
