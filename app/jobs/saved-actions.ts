"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleSaveJobAction(jobId: string) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { savedJobs: true } as any
        }) as any;

        if (!user) return { error: "User not found" };

        // @ts-ignore
        const existingSave = await prisma.savedJob.findUnique({
            where: {
                userId_jobId: {
                    userId: user.id,
                    jobId: jobId
                }
            }
        });

        if (existingSave) {
            // Unsave
            // @ts-ignore
            await prisma.savedJob.delete({
                where: { id: existingSave.id }
            });
        } else {
            // Save
            // @ts-ignore
            await prisma.savedJob.create({
                data: {
                    userId: user.id,
                    jobId: jobId
                }
            });
        }

        revalidatePath("/jobs");
        revalidatePath(`/jobs/${jobId}`);
        revalidatePath("/dashboard/profile/saved");

        return { success: true, saved: !existingSave };
    } catch (error) {
        console.error("Toggle save job failed:", error);
        return { error: "Failed to update saved jobs." };
    }
}

export async function getSavedJobsAction() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: {
                savedJobs: {
                    include: {
                        job: true
                    }
                }
            } as any
        }) as any;

        if (!user) return { error: "User not found" };

        return { savedJobs: user.savedJobs.map((sj: any) => sj.job) };
    } catch (error) {
        console.error("Fetch saved jobs failed:", error);
        return { error: "Failed to fetch saved jobs." };
    }
}
