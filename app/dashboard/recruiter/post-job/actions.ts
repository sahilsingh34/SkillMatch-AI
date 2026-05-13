"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server';
import { generateObject } from 'ai';
import { defaultModel } from '@/lib/ai';
import { z } from 'zod';

export async function createJobAction(formData: FormData) {
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

        const { userId } = await auth();
        if (!userId) {
            return { error: "Unauthorized. Please log in as a Recruiter." };
        }

        // Fetch or sync the Recruiter user in DB
        let recruiter = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!recruiter) {
            recruiter = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: `user_${userId}@clerk.local`,
                    role: 'RECRUITER'
                }
            });
        }

        // AI Skill Extraction from Job Description
        let extractedSkills: string[] = [];
        const hasApiKey = !!process.env.NVIDIA_API_KEY;

        if (hasApiKey) {
            try {
                const prompt = `You are an expert technical recruiter. Analyze the following job description and extract 5 to 10 core skills (e.g. 'React', 'Project Management') required for this role.\n\nDescription:\n${description}`;
                
                const { object } = await generateObject({
                    model: defaultModel,
                    schema: z.object({
                        skills: z.array(z.string()).describe("A list of 5-10 core technical and soft skills required for the job.")
                    }),
                    prompt
                });
                
                // Normalize skills: lowercase and unique
                const rawSkills = (object.skills || []).map((s: string) => s.trim().toLowerCase()).filter(Boolean);
                extractedSkills = Array.from(new Set(rawSkills)) as string[];
            } catch (aiError) {
                console.error("Failed to extract skills via NVIDIA:", aiError);
                extractedSkills = ["communication", "problem solving"];
            }
        } else {
            extractedSkills = ["communication", "problem solving"];
        }

        const skillsString = extractedSkills.length > 0 ? extractedSkills.join(', ') : "generalist";

        // Create Job in Prisma SQLite
        const newJob = await prisma.job.create({
            data: {
                title,
                company,
                location: location || "Remote",
                type: type || "Full-time",
                salary: salary || "Competitive",
                skills: skillsString,
                description,
                recruiterId: recruiter.id
            }
        });

        // Revalidate paths so the new job appears on the listings page
        revalidatePath("/jobs");
        revalidatePath("/dashboard/recruiter");

        return { success: true, jobId: newJob.id, skills: extractedSkills };
    } catch (error) {
        console.error("Job creation failed:", error);
        return { error: "Failed to create job posting. Please try again." };
    }
}
