"use server";

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server';

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
        if (description !== existingJob.description && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
                const schema = {
                    type: SchemaType.OBJECT,
                    properties: {
                        skills: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                        }
                    },
                    required: ["skills"]
                };
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash",
                    generationConfig: { responseMimeType: "application/json", responseSchema: schema as any }
                });
                const result = await model.generateContent(`Extract 5-10 core skills for: ${description}`);
                const parsedResult = JSON.parse(result.response.text());
                skillsString = (parsedResult.skills || []).join(', ');
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
