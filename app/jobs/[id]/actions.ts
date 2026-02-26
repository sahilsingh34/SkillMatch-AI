"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createApplicationAction(jobId: string) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return { success: false, error: "Unauthorized. Please log in first." };
        }

        // @ts-ignore - Prisma generated types cached out of sync
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true } as any
        }) as any;

        if (!user) {
            return { success: false, error: "User not found." };
        }

        if (!user.profile) {
            return { success: false, error: "Please complete your profile (upload resume) before applying." };
        }

        // 2. Fetch the Job to compare skills
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return { success: false, error: "Job not found." };
        }

        // 3. Prevent duplicate applications
        const existingApp = await prisma.applicant.findUnique({
            where: {
                jobId_userId: {
                    jobId: job.id,
                    userId: user.id
                }
            }
        });

        if (existingApp) {
            return { success: false, error: "You have already applied to this position." };
        }

        // 4. Calculate Match Score
        const jobSkills = job.skills.toLowerCase().split(',').map((s: string) => s.trim());
        const userSkills = user.profile.skills.toLowerCase().split(',').map((s: string) => s.trim());

        let matchCount = 0;
        jobSkills.forEach(reqSkill => {
            if (userSkills.includes(reqSkill)) {
                matchCount++;
            }
        });

        // Basic ratio, floor at 10% just for effort
        let score = jobSkills.length > 0 ? Math.round((matchCount / jobSkills.length) * 100) : 100;
        if (score < 10) score = 10;

        // 5. Insert Application Request
        await prisma.applicant.create({
            data: {
                jobId: job.id,
                userId: user.id,
                matchScore: score,
                skills: user.profile.skills,
                experience: user.profile.experience,
                status: "Applied"
            }
        });

        revalidatePath(`/dashboard/recruiter`);
        revalidatePath(`/dashboard/recruiter/jobs/${job.id}/applicants`);

        return { success: true };

    } catch (error) {
        console.error("Error creating application:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
