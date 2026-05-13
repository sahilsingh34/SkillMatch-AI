"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server';
import { generateObject } from 'ai';
import { defaultModel } from '@/lib/ai';
import { z } from 'zod';

export async function deleteJobAction(jobId: string) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { clerkId }
        });

        if (!user || user.role !== 'RECRUITER') {
            return { error: "Only recruiters can delete jobs." };
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job || job.recruiterId !== user.id) {
            return { error: "Job not found or unauthorized." };
        }

        await prisma.job.delete({
            where: { id: jobId }
        });

        revalidatePath("/jobs");
        revalidatePath("/dashboard/recruiter");
        return { success: true };
    } catch (error) {
        console.error("Job deletion failed:", error);
        return { error: "Failed to delete job posting." };
    }
}

export async function updateJobAction(jobId: string, formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const company = formData.get("company") as string;
        const location = formData.get("location") as string;
        const type = formData.get("type") as string;
        const salary = formData.get("salary") as string;
        const description = formData.get("description") as string;

        if (!title || !company || !description) {
            return { error: "Title, Company, and Description are required." };
        }

        const { userId: clerkId } = await auth();
        if (!clerkId) return { error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { clerkId }
        });

        if (!user || user.role !== 'RECRUITER') {
            return { error: "Only recruiters can update jobs." };
        }

        const existingJob = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!existingJob || existingJob.recruiterId !== user.id) {
            return { error: "Job not found or unauthorized." };
        }

        // AI Skill Extraction (if description changed)
        let skillsString = existingJob.skills;
        if (description !== existingJob.description && process.env.NVIDIA_API_KEY) {
            try {
                const { object } = await generateObject({
                    model: defaultModel,
                    schema: z.object({
                        skills: z.array(z.string()).describe("A list of 5-10 core technical and soft skills required for the job.")
                    }),
                    prompt: `Extract 5-10 core skills for: ${description}`
                });
                skillsString = (object.skills || []).join(', ');
            } catch (aiError) {
                console.error("Skill re-extraction failed:", aiError);
            }
        }

        await prisma.job.update({
            where: { id: jobId },
            data: {
                title,
                company,
                location: location || "Remote",
                type: type || "Full-time",
                salary: salary || "Competitive",
                skills: skillsString,
                description,
            }
        });

        revalidatePath("/jobs");
        revalidatePath(`/jobs/${jobId}`);
        revalidatePath("/dashboard/recruiter");

        return { success: true };
    } catch (error) {
        console.error("Job update failed:", error);
        return { error: "Failed to update job posting." };
    }
}
