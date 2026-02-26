"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getJobSeekerProfileAction() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { error: "Unauthorized" };

        // @ts-ignore - Prisma generated types cached out of sync
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (!user || user.role !== "SEEKER" || !user.profile) {
            return { profile: null };
        }

        return {
            profile: {
                skills: user.profile.skills,
                experience: user.profile.experience,
                resumeUrl: user.profile.resumeUrl,
            }
        };
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return { error: "Failed to fetch profile" };
    }
}
